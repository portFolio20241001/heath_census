// 患者を追加するボタンの要素を取得
const addPatientButton = document.getElementById("addPatient");
// 患者の報告を表示する要素を取得
const report = document.getElementById("report");
// 検索ボタンの要素を取得
const btnSearch = document.getElementById('btnSearch');
// 患者の情報を格納する配列
const patients = [];

// 新しい患者を追加する関数
function addPatient() {
    // 名前の入力値を取得
    const name = document.getElementById("name").value;
    // 性別の選択値を取得
    const gender = document.querySelector('input[name="gender"]:checked');
    // 年齢の入力値を取得
    const age = document.getElementById("age").value;
    // 病状の入力値を取得
    const condition = document.getElementById("condition").value;

    // すべての入力値が存在する場合に処理を実行
    if (name && gender && age && condition) {
        // 患者情報を配列に追加
        patients.push({ name, gender: gender.value, age, condition });
        // 入力フォームをリセット
        resetForm();
        // 報告を生成
        generateReport();
    }
}

// 入力フォームをリセットする関数
function resetForm() {
    // 名前の入力値を空にする
    document.getElementById("name").value = "";
    // 選択されている性別のチェックを解除
    document.querySelector('input[name="gender"]:checked').checked = false;
    // 年齢の入力値を空にする
    document.getElementById("age").value = "";
    // 病状の入力値を空にする
    document.getElementById("condition").value = "";
}

// 患者の報告を生成する関数
function generateReport() {
    // 患者の総数を取得
    const numPatients = patients.length;
    // 病状ごとのカウントを初期化
    const conditionsCount = {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
    };
    // 性別ごとの病状カウントを初期化
    const genderConditionsCount = {
        Male: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
        Female: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0,
        },
    };

    // 患者リストをループして病状をカウント
    for (const patient of patients) {
        conditionsCount[patient.condition]++;
        genderConditionsCount[patient.gender][patient.condition]++;
    }

    // 報告をHTMLに出力
    report.innerHTML = `患者の総数: ${numPatients}<br><br>`;
    report.innerHTML += `病状の内訳:<br>`;
    
    // 各病状ごとの患者数を表示
    for (const condition in conditionsCount) {
        report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
    }

    report.innerHTML += `<br>性別ごとの病状:<br>`;
    
    // 各性別ごとの病状の患者数を表示
    for (const gender in genderConditionsCount) {
        report.innerHTML += `${gender}:<br>`;
        for (const condition in genderConditionsCount[gender]) {
            report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
        }
    }
}

// 患者追加ボタンがクリックされたときに addPatient 関数を実行
addPatientButton.addEventListener("click", addPatient);

// 病状を検索する関数
function searchCondition() {
    // ユーザーが入力した病状の値を取得し、小文字に変換
    const input = document.getElementById('conditionInput').value.toLowerCase();
    // 結果を表示する要素を取得
    const resultDiv = document.getElementById('result');
    // 結果エリアをクリア
    resultDiv.innerHTML = '';

    // JSONデータを取得
    fetch('health_analysis.json')
        .then(response => response.json()) // JSONデータに変換
        .then(data => {
            // ユーザーが入力した病状と一致するデータを検索
            const condition = data.conditions.find(item => item.name.toLowerCase() === input);

            // 一致する病状が見つかった場合の処理
            if (condition) {
                // 症状、予防、治療の情報を取得し、カンマ区切りで結合
                const symptoms = condition.symptoms.join(', ');
                const prevention = condition.prevention.join(', ');
                const treatment = condition.treatment;

                // 結果をHTMLに表示
                resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
                resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="病状画像">`;
                resultDiv.innerHTML += `<p><strong>症状:</strong> ${symptoms}</p>`;
                resultDiv.innerHTML += `<p><strong>予防方法:</strong> ${prevention}</p>`;
                resultDiv.innerHTML += `<p><strong>治療法:</strong> ${treatment}</p>`;
            } else {
                // 病状が見つからなかった場合のメッセージを表示
                resultDiv.innerHTML = '病状が見つかりませんでした。';
            }
        })
        .catch(error => {
            // データ取得時のエラー処理
            console.error('エラー:', error);
            resultDiv.innerHTML = 'データ取得中にエラーが発生しました。';
        });
}

// 検索ボタンがクリックされたときに searchCondition 関数を実行
btnSearch.addEventListener('click', searchCondition);
