"use strict";

const snapshots = `${process.env.INSTANCE_FILES_DIR}/snapshots`;

const testPathForConsistencyCheck =
  "/app/src/client/policeDataManager/officers/OfficerSearch/OfficerSearchResults/OfficerSearchResultsRow.test.js";

const resolveSnapshotPath = (testPath, snapshotExtension) => {
  const post = testPath.substring(testPath.indexOf("src") + 3);
  const snapshotPath = snapshots + post + snapshotExtension;
  console.log("TESTPATH!!! ", testPath);
  console.log("SNAPSHOT!!!!---", snapshots);
  console.log("blahhhhhhhhhhhh", snapshotPath);

  return snapshotPath;
};

const resolveTestPath = (snapshotFilePath, snapshotExtension) => {
  return snapshotFilePath
    .replace(snapshots, "/root/project/src")
    .slice(0, -snapshotExtension.length);
};

module.exports = {
  resolveSnapshotPath,
  resolveTestPath,
  testPathForConsistencyCheck
};
