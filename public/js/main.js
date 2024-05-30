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
        
        this.yearData.forEach(entry => {
            let option = document.createElement('option');
            option.value = entry.year;
            option.text = `${entry.year}年：${entry.award}`;
            yearEl.add(option);
        });

        yearEl.addEventListener('change' , (event) => {
            if (event.target.value) {
                this.searchWords.year = event.target.value;
                this.displayRaceSelector(this.searchWords.year);
            } else {
                // 空白が選択された場合レースプルダウンをリセット
                const raceEl = document.getElementById('race');
                raceEl.innerHTML = `<option value="">---</option>`
            }
        });
    }

    async displayRaceSelector(year) {
        await this.fetchRaceData(year);
        const raceEl = document.getElementById('race');

        this.racesData.races.forEach(entry => {
            let option = document.createElement('option');
            option.value = entry.name;
            option.text = `${entry.name}：${entry.winner}`;
            raceEl.add(option);
        });

        raceEl.addEventListener('change' , (event) => {
            if (event.target.value) {
                this.searchWords.race = event.target.value;
                alert(`${this.searchWords.year}:${this.searchWords.race}`);
            }
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