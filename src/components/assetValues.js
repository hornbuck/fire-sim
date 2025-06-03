// *** The functions below allow external files to change and access ***
// *** the number of firefighting assets the player has access to.   ***

//* Asset Limits
export let hose = 10;
export let extinguisher = 5;
export let helicopter = 3;
export let firetruck = 3;
export let airtanker = 2;
export let hotshotcrew = 2;
export let smokejumper = 5;

// Get the number of HOSE assets (useful for external files)
export function getHose() {
    return hose;
}

// Set the number of HOSE assets (useful for external files)
export function setHose(value) {
    hose += value;
}

// Get the number of EXTINGUISHER assets (useful for external files)
export function getExtinguisher() {
    return extinguisher;
}

// Set the number of EXTINGUISHER assets (useful for external files)
export function setExtinguisher(value) {
    extinguisher += value;
}

// Get the number of HELICOPTER assets (useful for external files)
export function getHelicopter() {
    return helicopter;
}

// Set the number of HELICOPTER assets (useful for external files)
export function setHelicopter(value) {
    helicopter += value;
}

// Get the number of FIRETRUCK assets (useful for external files)
export function getFiretruck() {
    return firetruck;
}

// Set the number of FIRETRUCK assets (useful for external files)
export function setFiretruck(value) {
    firetruck += value;
}

// Get the number of AIRTANKER assets (useful for external files)
export function getAirtanker() {
    return airtanker;
}

// Set the number of AIRTANKER assets (useful for external files)
export function setAirtanker(value) {
    airtanker += value;
}

// Get the number of HOTSHOT CREW assets (useful for external files)
export function getHotshotCrew() {
    return hotshotcrew;
}

// Set the number of HOTSHOT CREW assets (useful for external files)
export function setHotshotCrew(value) {
    hotshotcrew += value;
}

// Get the number of SMOKEJUMPER assets (useful for external files)
export function getSmokejumpers() {
    return smokejumper;
}

// Set the number of SMOKEJUMPER assets (useful for external files)
export function setSmokejumpers(value) {
    smokejumper += value;
}

/**
 * Re‐initialize all asset‐count variables back to their original defaults.
 */
export function resetAssetValues() {
  hose = 10;
  extinguisher = 5;
  helicopter = 3;
  firetruck = 3;
  airtanker = 2;
  hotshotcrew = 2;
  smokejumper = 5;
}