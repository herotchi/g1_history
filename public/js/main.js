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

        const raceEl = document.getElementById('race');
        raceEl.addEventListener('change' , (event) => {
            if (event.target.value) {
                console.log(event.target.value);
                this.searchWords.race = event.target.value;
                this.searchYouTube();
            }
        });
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
            if (this.validateYear(event.target.value)) {
                this.searchWords.year = event.target.value;
                this.displayRaceSelector(this.searchWords.year);
            } else {
                // 入力エラーや空白が選択された場合、レースのプルダウンをリセット
                const raceEl = document.getElementById('race');
                raceEl.innerHTML = `<option value="">---</option>`;
            }
        });
    }

    async displayRaceSelector(year) {
        await this.fetchRaceData(year);
        const raceEl = document.getElementById('race');
        raceEl.innerHTML = `<option value="">---</option>`

        this.racesData.races.forEach(entry => {
            let option = document.createElement('option');
            option.value = entry.name;
            option.text = `${entry.name}：${entry.winner}`;
            raceEl.add(option);
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

    async searchYouTube()
    {
        try {
            const response = await fetch(`./api/search?year=${this.searchWords.year}&race=${this.searchWords.race}`);
            const data = await response.json();
            console.log(data);
            if (data.errors) {
                console.log("エラーあり");
            } else {
                console.log("エラーなし");
            }
        } catch (error) {
            //console.log(error);
        }
    }

    validateYear(year) {
        // 空でないかどうかをチェックする
        if (year === null || year === undefined || year === '') {
            return false;
        }
        // 数値であるかどうかをチェックする
        if (isNaN(year)) {
            return false;
        }
        // 整数であるかどうかをチェックする
        if (!Number.isInteger(Number(year))) {
            return false;
        }
        // year.jsonに含まれる年代がチェックする
        if (!this.yearData.some(item => {item.year === Number(year)})) {
            return false;
        }

        return true;
    }
}

new G1History(document.getElementById('container')).init();