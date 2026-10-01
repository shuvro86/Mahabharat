import mongoose, { Types } from "mongoose";
import { User } from "../models/User";
import { Word } from "../models/Word";
import { Character } from "../models/Character";
import { Shloka } from "../models/Shloka";
import { Progress } from "../models/Progress";
import { QuizHistory } from "../models/QuizHistory";
import { SearchHistory } from "../models/SearchHistory";
import { VerificationChallenge } from "../models/VerificationChallenge";

// In-Memory Storage Tables
const memoryStore: {
  users: any[];
  words: any[];
  characters: any[];
  shlokas: any[];
  progresses: any[];
  quizHistories: any[];
  searchHistories: any[];
  verificationChallenges: any[];
} = {
  users: [],
  words: [],
  characters: [],
  shlokas: [],
  progresses: [],
  quizHistories: [],
  searchHistories: [],
  verificationChallenges: []
};

function getCollection(modelName: string): any[] {
  switch (modelName) {
    case "User": return memoryStore.users;
    case "Word": return memoryStore.words;
    case "Character": return memoryStore.characters;
    case "Shloka": return memoryStore.shlokas;
    case "Progress": return memoryStore.progresses;
    case "QuizHistory": return memoryStore.quizHistories;
    case "SearchHistory": return memoryStore.searchHistories;
    case "VerificationChallenge": return memoryStore.verificationChallenges;
    default: return [];
  }
}

function normalizeDoc(doc: any, modelName: string) {
  if (!doc) return null;
  const raw = { ...doc };

  if (!raw._id) {
    raw._id = new Types.ObjectId();
  }
  const idStr = raw._id.toString();

  // Create document object with virtuals & Mongoose instance helpers
  const instance: any = {
    ...raw,
    _id: raw._id,
    id: idStr,
    save: async function() {
      const coll = getCollection(modelName);
      const idx = coll.findIndex((item) => item._id.toString() === idStr);
      this.updatedAt = new Date();
      if (idx !== -1) {
        coll[idx] = { ...this };
      } else {
        coll.push({ ...this });
      }
      return this;
    },
    toObject: function() {
      return { ...this };
    },
    toJSON: function() {
      const obj = { ...this };
      delete obj.save;
      delete obj.toObject;
      delete obj.toJSON;
      return obj;
    }
  };

  if (modelName === "Word") {
    Object.defineProperty(instance, "sanskrit", {
      get: () => instance.arabic,
      set: (val: string) => { instance.arabic = val; },
      enumerable: true,
      configurable: true
    });
  }

  return instance;
}

function matchesQuery(doc: any, query: any): boolean {
  if (!query || Object.keys(query).length === 0) return true;

  // Handle $or
  if (query.$or && Array.isArray(query.$or)) {
    const orMatch = query.$or.some((subQuery: any) => matchesQuery(doc, subQuery));
    if (!orMatch) return false;
  }

  for (const key of Object.keys(query)) {
    if (key === "$or") continue;

    const val = query[key];
    const docVal = doc[key];

    if (val instanceof RegExp) {
      if (!val.test(String(docVal !== undefined && docVal !== null ? docVal : ""))) return false;
    } else if (val && typeof val === "object" && !Array.isArray(val) && !(val instanceof Date) && !(val instanceof Types.ObjectId)) {
      if (val.$regex) {
        const flags = val.$options !== undefined ? val.$options : (val.$regex instanceof RegExp ? val.$regex.flags : "");
        const pattern = val.$regex instanceof RegExp ? val.$regex.source : String(val.$regex);
        const regex = new RegExp(pattern, flags);
        if (!regex.test(String(docVal !== undefined && docVal !== null ? docVal : ""))) return false;
      }
      if (val.$nin && Array.isArray(val.$nin)) {
        const ninStrings = val.$nin.map((item: any) => item?.toString ? item.toString() : String(item));
        const docValStr = docVal?.toString ? docVal.toString() : String(docVal);
        if (ninStrings.includes(docValStr)) return false;
      }
      if (val.$lte !== undefined) {
        const targetDate = new Date(val.$lte).getTime();
        const docDate = new Date(docVal).getTime();
        if (isNaN(docDate) || docDate > targetDate) return false;
      }
      if (val.$gt !== undefined) {
        const targetDate = new Date(val.$gt).getTime();
        const docDate = new Date(docVal).getTime();
        if (isNaN(docDate) || docDate <= targetDate) return false;
      }
    } else if (val !== undefined) {
      const targetStr = val?.toString ? val.toString() : String(val);
      const docStr = docVal?.toString ? docVal.toString() : String(docVal);
      if (targetStr !== docStr) return false;
    }
  }

  return true;
}

function populateDoc(doc: any, path: string) {
  if (!doc) return doc;
  const clone = { ...doc };

  if (path === "wordId" && clone.wordId) {
    const wordIdStr = clone.wordId._id ? clone.wordId._id.toString() : clone.wordId.toString();
    const word = memoryStore.words.find((w) => w._id.toString() === wordIdStr);
    if (word) {
      clone.wordId = normalizeDoc(word, "Word");
    }
  }

  return clone;
}

class QueryPromiseChain implements PromiseLike<any> {
  private modelName: string;
  private query: any;
  private skipNum = 0;
  private limitNum = 0;
  private sortObj: any = null;
  private populatePath: string | null = null;
  private isSingle = false;

  constructor(modelName: string, query: any = {}, isSingle = false) {
    this.modelName = modelName;
    this.query = query;
    this.isSingle = isSingle;
  }

  skip(n: number) {
    this.skipNum = n;
    return this;
  }

  limit(n: number) {
    this.limitNum = n;
    return this;
  }

  sort(sortObj: any) {
    this.sortObj = sortObj;
    return this;
  }

  populate(path: string) {
    this.populatePath = path;
    return this;
  }

  lean() {
    return this;
  }

  async execute() {
    const collection = getCollection(this.modelName);
    let results = collection.filter((doc) => matchesQuery(doc, this.query));

    if (this.sortObj) {
      const key = Object.keys(this.sortObj)[0];
      const dir = this.sortObj[key] === -1 || this.sortObj[key] === "desc" ? -1 : 1;
      results.sort((a, b) => {
        const valA = a[key] instanceof Date ? a[key].getTime() : a[key];
        const valB = b[key] instanceof Date ? b[key].getTime() : b[key];
        if (valA < valB) return -1 * dir;
        if (valA > valB) return 1 * dir;
        return 0;
      });
    }

    if (this.skipNum > 0) {
      results = results.slice(this.skipNum);
    }
    if (this.limitNum > 0) {
      results = results.slice(0, this.limitNum);
    }

    let normalized = results.map((d) => normalizeDoc(d, this.modelName));

    if (this.populatePath) {
      normalized = normalized.map((d) => populateDoc(d, this.populatePath!));
    }

    if (this.isSingle) {
      return normalized.length > 0 ? normalized[0] : null;
    }

    return normalized;
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export function patchModelForInMemory(Model: any, modelName: string) {
  const origFind = Model.find.bind(Model);
  const origFindOne = Model.findOne.bind(Model);
  const origFindById = Model.findById.bind(Model);
  const origCreate = Model.create.bind(Model);
  const origCount = Model.countDocuments.bind(Model);
  const origDistinct = Model.distinct.bind(Model);
  const origAggregate = Model.aggregate.bind(Model);
  const origFindByIdAndUpdate = Model.findByIdAndUpdate.bind(Model);
  const origFindByIdAndDelete = Model.findByIdAndDelete.bind(Model);
  const origDeleteMany = Model.deleteMany.bind(Model);
  const origInsertMany = Model.insertMany ? Model.insertMany.bind(Model) : null;

  Model.insertMany = async function (docs: any, options: any) {
    if (mongoose.connection.readyState === 1 && origInsertMany) {
      return origInsertMany(docs, options);
    }
    return Model.create(docs);
  };

  Model.find = function (query: any) {
    if (mongoose.connection.readyState === 1) return origFind(query);
    return new QueryPromiseChain(modelName, query, false);
  };

  Model.findOne = function (query: any) {
    if (mongoose.connection.readyState === 1) return origFindOne(query);
    return new QueryPromiseChain(modelName, query, true);
  };

  Model.findById = function (id: any) {
    if (mongoose.connection.readyState === 1) return origFindById(id);
    const idStr = id?._id ? id._id.toString() : String(id);
    return new QueryPromiseChain(modelName, { _id: idStr }, true);
  };

  Model.create = async function (data: any) {
    if (mongoose.connection.readyState === 1) return origCreate(data);
    const collection = getCollection(modelName);
    const items = Array.isArray(data) ? data : [data];
    const createdItems: any[] = [];

    for (const item of items) {
      const newDoc = {
        ...item,
        _id: item._id || new Types.ObjectId(),
        createdAt: item.createdAt || new Date(),
        updatedAt: item.updatedAt || new Date()
      };
      collection.push(newDoc);
      createdItems.push(normalizeDoc(newDoc, modelName));
    }

    return Array.isArray(data) ? createdItems : createdItems[0];
  };

  Model.countDocuments = async function (query: any = {}) {
    if (mongoose.connection.readyState === 1) return origCount(query);
    const collection = getCollection(modelName);
    return collection.filter((doc) => matchesQuery(doc, query)).length;
  };

  Model.distinct = async function (field: string, query: any = {}) {
    if (mongoose.connection.readyState === 1) return origDistinct(field, query);
    const collection = getCollection(modelName);
    const matched = collection.filter((doc) => matchesQuery(doc, query));
    const values = matched.map((d) => d[field]?.toString ? d[field].toString() : d[field]).filter(Boolean);
    return Array.from(new Set(values));
  };

  Model.aggregate = async function (pipeline: any[]) {
    if (mongoose.connection.readyState === 1) return origAggregate(pipeline);
    const collection = getCollection(modelName);
    let results = [...collection];

    for (const stage of pipeline) {
      if (stage.$sample && stage.$sample.size) {
        const size = stage.$sample.size;
        results = [...results].sort(() => Math.random() - 0.5).slice(0, size);
      }
    }

    return results.map((d) => normalizeDoc(d, modelName));
  };

  Model.findByIdAndUpdate = async function (id: any, update: any, options: any = {}) {
    if (mongoose.connection.readyState === 1) return origFindByIdAndUpdate(id, update, options);
    const collection = getCollection(modelName);
    const idStr = id?._id ? id._id.toString() : String(id);
    const idx = collection.findIndex((doc) => doc._id.toString() === idStr);

    if (idx === -1) return null;

    const existing = collection[idx];
    const updated = {
      ...existing,
      ...update,
      _id: existing._id,
      updatedAt: new Date()
    };
    collection[idx] = updated;

    return normalizeDoc(updated, modelName);
  };

  Model.findByIdAndDelete = async function (id: any) {
    if (mongoose.connection.readyState === 1) return origFindByIdAndDelete(id);
    const collection = getCollection(modelName);
    const idStr = id?._id ? id._id.toString() : String(id);
    const idx = collection.findIndex((doc) => doc._id.toString() === idStr);

    if (idx === -1) return null;

    const [deleted] = collection.splice(idx, 1);
    return normalizeDoc(deleted, modelName);
  };

  Model.deleteMany = async function (query: any = {}) {
    if (mongoose.connection.readyState === 1) return origDeleteMany(query);
    const collection = getCollection(modelName);
    const remaining = collection.filter((doc) => !matchesQuery(doc, query));
    const deletedCount = collection.length - remaining.length;

    switch (modelName) {
      case "User": memoryStore.users = remaining; break;
      case "Word": memoryStore.words = remaining; break;
      case "Character": memoryStore.characters = remaining; break;
      case "Shloka": memoryStore.shlokas = remaining; break;
      case "Progress": memoryStore.progresses = remaining; break;
      case "QuizHistory": memoryStore.quizHistories = remaining; break;
      case "SearchHistory": memoryStore.searchHistories = remaining; break;
      case "VerificationChallenge": memoryStore.verificationChallenges = remaining; break;
    }

    return { deletedCount };
  };
}

export function patchAllModels() {
  patchModelForInMemory(User, "User");
  patchModelForInMemory(Word, "Word");
  patchModelForInMemory(Character, "Character");
  patchModelForInMemory(Shloka, "Shloka");
  patchModelForInMemory(Progress, "Progress");
  patchModelForInMemory(QuizHistory, "QuizHistory");
  patchModelForInMemory(SearchHistory, "SearchHistory");
  patchModelForInMemory(VerificationChallenge, "VerificationChallenge");
}

export function clearInMemoryStore() {
  memoryStore.users = [];
  memoryStore.words = [];
  memoryStore.characters = [];
  memoryStore.shlokas = [];
  memoryStore.progresses = [];
  memoryStore.quizHistories = [];
  memoryStore.searchHistories = [];
  memoryStore.verificationChallenges = [];
}
