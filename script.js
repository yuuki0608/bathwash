document.addEventListener('DOMContentLoaded', function() {
            const calendarElement = document.querySelector('.calendar');
            const subtitleElement = document.querySelector('.subtitle');
            const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
            let selectedDates = {};

            // 現在の年月を取得
            const currentDate = new Date();
            let currentYear = currentDate.getFullYear();
            let currentMonth = currentDate.getMonth() + 1; // 月は0から始まるので+1する
            const today = currentDate.getDate();
            const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

            // 題名の下に年月を表示
            subtitleElement.textContent = `${currentYear}年${currentMonth}月のカレンダー`;

            // 曜日を追加
            for (let i = 0; i < daysOfWeek.length; i++) {
                const dayElement = document.createElement('div');
                dayElement.textContent = daysOfWeek[i];
                dayElement.classList.add('day');
                calendarElement.appendChild(dayElement);
            }

            // 日付を追加
            for (let i = 1; i <= daysInMonth; i++) {
                const dateElement = document.createElement('div');
                dateElement.textContent = i;
                dateElement.classList.add('hoverable'); // ホバー効果を追加

                // 今日以降の日付を無効化する
                if (i > today && currentMonth === currentDate.getMonth() + 1) {
                    dateElement.classList.add('disabled');
                }

                // クリック時の処理
                dateElement.addEventListener('click', function() {
                    if (!dateElement.classList.contains('disabled')) {
                        const selected = selectedDates[i];
                        if (!selected) {
                            const person = prompt(`${i}日の洗った人を選んでください（あおい、ゆうき、その他）`);
                            if (person !== null && person !== '') {
                                if (validatePerson(person)) {
                                    const confirmMessage = `一度選択すると変更できません。${person}でよろしいですか？`;
                                    if (confirm(confirmMessage)) {
                                        selectedDates[i] = person;
                                        updateCalendar();
                                        saveToCookie();
                                    }
                                } else {
                                    alert('選択できるのは「あおい」、「ゆうき」、「その他」のみです。');
                                }
                            }
                        }
                    }
                });

                calendarElement.appendChild(dateElement);
            }

            // カレンダーを更新する関数
            function updateCalendar() {
                // 日付のスタイルを更新
                const dateElements = calendarElement.querySelectorAll('.hoverable');
                dateElements.forEach(element => {
                    const day = parseInt(element.textContent);
                    const selected = selectedDates[day];
                    element.classList.remove('aoi', 'yuuki', 'sonota');
                    if (selected === 'あおい') {
                        element.classList.add('aoi');
                    } else if (selected === 'ゆうき') {
                        element.classList.add('yuuki');
                    } else if (selected === 'その他') {
                        element.classList.add('sonota');
                    }
                });
            }

            // Cookieに選択情報を保存する関数
            function saveToCookie() {
                const jsonSelectedDates = JSON.stringify(selectedDates);
                const cookieName = `selectedDates_${currentYear}_${currentMonth}`;
                const expires = new Date();
                expires.setMonth(expires.getMonth() + 1);
                document.cookie = `${cookieName}=${jsonSelectedDates}; expires=${expires.toUTCString()}; path=/`;
            }

            // Cookieから選択情報を読み込む関数（初期化時に呼び出す）
            function loadFromCookie() {
                const cookieName = `selectedDates_${currentYear}_${currentMonth}`;
                const cookieValue = document.cookie
                    .split('; ')
                    .find(row => row.startsWith(cookieName))
                    ?.split('=')[1];
                if (cookieValue) {
                    selectedDates = JSON.parse(decodeURIComponent(cookieValue));
                    updateCalendar();
                }
            }

            // 初期化時にCookieから選択情報を読み込む
            loadFromCookie();

            // 洗った人の選択が正しいかどうかを検証する関数
            function validatePerson(person) {
                const validPeople = ['あおい', 'ゆうき', 'その他'];
                return validPeople.includes(person);
            }
        });
