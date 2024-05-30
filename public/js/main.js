class G1History
{
    constructor(rootEl) {
        this.rootEl = rootEl;
        this.searchWords = {
            'year': null,
            'race': null
        };
        this.yearData = null;
        this.racesData = null;
    }


    async init() {
        await this.fetchYearData();
        this.displayYearSelector();
    }

    async fetchYearData() {
        try {
            const response = await fetch('./json/year.json');
            this.yearData = await response.json();
        } catch (error) {
            console.log(error);
        }
    }

    displayYearSelector() {
        const yearEl = document.getElementById('year');
        
        const options = [];
        options.push(`<option value="">---</option>`);
        for (let i = 0; i < this.yearData.length; i++) {
            console.log(this.yearData[i]);
            options.push(`<option value="${this.yearData[i]['year']}">${this.yearData[i]['year']}: ${this.yearData[i]['award']}</option>`);
        }
        yearEl.innerHTML = options.join('');

        yearEl.addEventListener('change' , (event) => {
            this.searchWords.year = event.target.value;
            this.displayRaceSelector(this.searchWords.year);
        });
    }

    async displayRaceSelector(year) {
        await this.fetchRaceData(year);
        const raceEl = document.getElementById('race');

        const options = [];
        options.push(`<option value="">---</option>`);
        for (let i = 0; i < this.racesData.races.length; i++) {
            console.log(this.racesData.races[i]);
            options.push(`<option value="${this.racesData.races[i]['name']}">${this.racesData.races[i]['name']}: ${this.racesData.races[i]['winner']}</option>`);
        }
        raceEl.innerHTML = options.join('');

        raceEl.addEventListener('change' , (event) => {
            this.searchWords.race = event.target.value;
            alert(`${this.searchWords.year}:${this.searchWords.race}`);
        });
    }

    async fetchRaceData(year) {
        try {
            const response = await fetch('./json/race.json');
            const tmp = await response.json();
            this.racesData = tmp.find(entry => entry.year == year);
        } catch (error) {
            console.log(error);
        }
    }
}

new G1History(document.getElementById('container')).init();