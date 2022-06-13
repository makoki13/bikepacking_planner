import Dexie from "dexie";
import {importDB, exportDB, importInto, peakImportFile} from "dexie-export-import";

//
// Import from Blob or File to Dexie instance:
//
const db = await importDB(blob, [options]);

//
// Export to Blob
//
const blob = await exportDB(db, [options]);

//
// Import from Blob or File to existing Dexie instance
//
await importInto(db, blob, [options]);

//
// If you need to peek the metadata from the import file without actually
// performing any import operation
// (since v1.0.0)
//
const importMeta = await peekImportFile(blob);
assert.areEqual(importMeta.formatName, "dexie");
assert.isTrue(importMeta.formatVersion === 1);
console.log("Database name:", importMeta.data.databaseName);
console.log("Database version:", importMeta.data.databaseVersion);
console.log("Database version:", importMeta.data.databaseVersion);
console.log("Tables:", importMeta.data.tables.map(t =>
  `${t.name} (${t.rowCount} rows)`
).join('\n\t'));

