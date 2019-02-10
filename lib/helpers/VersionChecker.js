const rp = require('request-promise-native');
const { PerkPage, SummonerSpellList, ItemSet } = require('../models');

class VersionChecker {
  constructor() {
    this.regions = ['na', 'euw', 'eune', 'br', 'jp', 'kr', 'lan', 'las', 'oce', 'tr', 'ru', 'pbe'];
    this.available = true;
  }

  async loadVersions() {
    this.versions = [];

    console.log('[VersionChecker] Loading versions per regions');

    for (let i = 0; i < this.regions.length; i++) {
      try {
        const res = await rp(`https://ddragon.leagueoflegends.com/realms/${this.regions[i]}.json`);

        this.versions.push(JSON.parse(res).v);
        console.log('[VersionChecker] Version for region', this.regions[i], 'is', this.versions[i]);
      }
      catch(err) {
        console.log('[VersionChecker] Couldn\'t load version for region', this.regions[i]);
        console.error(err);

        this.available = false;
      }
    }

    this.available = true;
  }

  isValidVersion(gameVersion, gameRegion) {
    return this.versions[this.regions.findIndex(x => x === gameRegion)] === gameVersion;
  }

  async searchForOutdatedData() {
    if (!this.available) return;

    for (let i = 0; i < this.regions.length; i++) {
      console.log('[VersionChecker] Deleting outdated data for region', this.regions[i]);

      try {
        await PerkPage.deleteMany({ gameVersion: { $ne: this.versions[i] }, gameRegion: this.regions[i] }).exec();
      }
      catch(err) {
        console.log('[VersionChecker] Couldn\'t delete outdated data for region', this.regions[i]);
        console.error(err);
      }
    }
  }
}

module.exports = VersionChecker;
