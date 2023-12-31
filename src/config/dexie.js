import Dexie from "dexie";

// Create database and playlist store/collection
const db = new Dexie("IPTV");
db.version(1).stores({
  playlists: "++id,&name,data",
  favorLists: '++id,name,url,logo'
});

export default db;
