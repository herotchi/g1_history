class G1History
{
    constructor(rootEl) {
        this.rootEl = rootEl;
        this.searchWords = {
            'year': null,
            'race': null
        };
        this.yearData = null;
        this.raceData = null;
        this.idList = null;
    }


    async init() {
        // iframe Player APIを非同期で読み込み
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        await this.fetchYearData();
        this.displayYearSelector();

        const raceEl = document.getElementById('race');
        raceEl.addEventListener('change' , (event) => {
            if (event.target.value !== '' && this.validateRace(event.target.value)) {
                raceEl.classList.remove('is-invalid');
                // 既に存在するiframeタグを削除する
                const playlistEl = document.getElementById('playlist');
                while (playlistEl.firstChild) {
                    playlistEl.removeChild(playlistEl.firstChild);
                }

                this.searchWords.race = event.target.value;
                this.searchYouTube();
            } else {
                if (event.target.value === '') {
                    raceEl.classList.remove('is-invalid');
                } else {
                    raceEl.classList.add('is-invalid');
                    this.showToast('入力エラーです。');
                }
            }
        });
    }

    async fetchYearData() {
        try {
            const response = await fetch('./json/year.json');
            this.yearData = await response.json();
        } catch (error) {
            this.showToast('読み込みに失敗しました。');
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
            if (event.target.value !== '' && this.validateYear(event.target.value)) {
                yearEl.classList.remove('is-invalid');
                this.searchWords.year = event.target.value;
                this.displayRaceSelector(this.searchWords.year);
            } else {
                // 入力エラーや空白が選択された場合、子のレースのプルダウンをリセット
                const raceEl = document.getElementById('race');
                raceEl.innerHTML = `<option value="">---</option>`;
                if (event.target.value === '') {
                    yearEl.classList.remove('is-invalid');
                } else {
                    yearEl.classList.add('is-invalid');
                    this.showToast('入力エラーです。');
                }
            }
        });
    }

    async displayRaceSelector(year) {
        await this.fetchRaceData(year);
        const raceEl = document.getElementById('race');
        raceEl.innerHTML = `<option value="">---</option>`;

        this.raceData.races.forEach(entry => {
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
            this.raceData = tmp.find(entry => entry.year == year);
        } catch (error) {
            this.showToast('読み込みに失敗しました。');
        }
    }

    async searchYouTube()
    {
        try {
            const response = await fetch(`./api/search?year=${this.searchWords.year}&race=${this.searchWords.race}`);
            const data = await response.json();
            if (data.errors) {
                this.showToast('入力エラーです。');
            } else {
                this.idList = data.idList;
                this.setVideos();
            }
        } catch (error) {
            this.showToast('通信に失敗しました。');
        }
    }

    async setVideos() {
        window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this);

        const playlist = document.getElementById('playlist');
        for (let i = 0; i < this.idList.length; i++) {
            const newDiv = document.createElement('div');
            newDiv.id = `player${i}`;
            newDiv.className = 'player mt-3';
            playlist.appendChild(newDiv);
            this.onYouTubeIframeAPIReady(`player${i}`, this.idList[i]);
        }
    }

    onYouTubeIframeAPIReady(id, videoId) {

        const playlistEl = document.getElementById('playlist');
        const style = getComputedStyle(playlistEl);
        const paddingLeft = parseFloat(style.paddingLeft);
        const paddingRight = parseFloat(style.paddingRight);
    
        // clientWidth から padding を除いた幅を計算
        const widthWithoutPadding = playlistEl.clientWidth - paddingLeft - paddingRight;

        // プレイヤーを初期化
        this.player = new YT.Player(id, {
            videoId: videoId,
            width: widthWithoutPadding
        });
    }

    validateYear(year) {
        // 空でないかどうかをチェックする
        if (year === null || year === undefined) {
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
        // year.jsonに含まれる年代かチェックする
        if (year !== '' && !this.yearData.some(item => {
            return item.year === Number(year)
        })) {
            return false;
        }

        return true;
    }

    validateRace(race) {
        // 空でないかどうかをチェックする
        if (race === null || race === undefined) {
            return false;
        }

        // 文字列かどうかチェックする
        if (typeof race !== 'string') {
            return false;
        }

        // 指定した年に含まれるレースかチェックする
        if (race !== '' && !this.raceData.races.some(item => {
            return item.name === race
        })) {
            return false;
        }

        return true;
    }

    showToast(message) {
        const toastEl = document.getElementById('toast');
        const toast = new bootstrap.Toast(toastEl);
        const element = toastEl.querySelector('.toast-body');
        element.textContent  = message;
        toast.show();
    }
}

new G1History(document.getElementById('container')).init();
