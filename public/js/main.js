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
            if (event.target.value) {
                // 既に存在するiframeタグを削除する
                const playlistEl = document.getElementById('playlist');
                while (playlistEl.firstChild) {
                    playlistEl.removeChild(playlistEl.firstChild);
                }

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
            if (data.errors) {
                console.log("エラーあり");
            } else {
                console.log("エラーなし");
                this.idList = data.idList;
                this.setVideos();
            }
        } catch (error) {
            //console.log(error);
        }
    }

    async setVideos() {
        window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this);

        const playlist = document.getElementById('playlist');
        console.log(this.idList);
        for (let i = 0; i < this.idList.length; i++) {
            const newDiv = document.createElement('div');
            newDiv.id = `player${i}`;
            //newDiv.className = 'player mt-3 col-md-12';
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
        if (!this.yearData.some(item => {
            return item.year === Number(year)
        })) {
            return false;
        }

        return true;
    }
}

new G1History(document.getElementById('container')).init();

/*var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);*/

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      /*var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '360',
          width: '640',
          videoId: 'M7lc1UVf-VE',
        });
      }*/