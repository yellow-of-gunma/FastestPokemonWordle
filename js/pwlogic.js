var bestProspect = {}
var candidate = []
var option = {}

/**
 *  世代一覧
 */
 function getQuestionRangeMap(){
    return {
        0: "赤・緑",
        1: "金・銀",
        2: "ルビー・サファイア",
        3: "ダイヤモンド・パール",
        4: "ブラック・ホワイト",
        5: "X・Y",
        6: "サン・ムーン",
        7: "ソード・シールド"
    }
}

/**
 *  世代を指定し、それ以前のポケモンをすべて取得する
 */
function getPokemonListByRange(range){
  const allList = getPokemonList()
  const result = []
  allList.forEach(pokemon=>{
    if (pokemon.range <= range){
      result.push(pokemon)
    }
  })
  return result
}
/**
 *  ラジオボタンのDOMを全て取得
 */
function getRadioDomList(){
    return [
        document.getElementsByName('radio0'),
        document.getElementsByName('radio1'),
        document.getElementsByName('radio2'),
        document.getElementsByName('radio3'),
        document.getElementsByName('radio4'),
    ]
}
/**
 *  世代選択欄のDOMを要素単位で全て取得
 */
function getRangeColumnDomList(){
    return [
        document.getElementById('qRange'),
        document.getElementById('startButton')
    ]
}
/**
 *  回答欄のDOMを要素単位で全て取得
 */
function getAnswerColumnDomList(){
    return [
        document.getElementById('radio00'),
        document.getElementById('radio01'),
        document.getElementById('radio02'),
        document.getElementById('radio10'),
        document.getElementById('radio11'),
        document.getElementById('radio12'),
        document.getElementById('radio20'),
        document.getElementById('radio21'),
        document.getElementById('radio22'),
        document.getElementById('radio30'),
        document.getElementById('radio31'),
        document.getElementById('radio32'),
        document.getElementById('radio40'),
        document.getElementById('radio41'),
        document.getElementById('radio42'),
        document.getElementById('nextButton'),
        document.getElementById('clearButton'),
        document.getElementById('giveUpButton')
    ]
}
/**
 *  一文字表示のDOMを全て取得
 */
function getCharDomList(){
    return [
        document.getElementById('char0'),
        document.getElementById('char1'),
        document.getElementById('char2'),
        document.getElementById('char3'),
        document.getElementById('char4'),
    ]
}
/**
 *  初期化
 */
function init(_option){
    if (_option) {
        option = _option;
    }

    // 世代のプルダウンリストの作成
    const qRangeMap = getQuestionRangeMap();
    for (let key in qRangeMap) {
        const op = document.createElement("option");
        op.value = key;
        op.text = qRangeMap[key];
        document.getElementById("qRange").appendChild(op);
    }

    // ギブアップ直後と同じ状態へ
    giveUp()
}
/**
 *  ゲームスタート
 */
function start(){
    // 世代選択を全て無効
    getRangeColumnDomList().forEach(dom=>{
        dom.setAttribute("disabled", true);
    })

    // 回答欄を全て有効
    getAnswerColumnDomList().forEach(dom=>{
        dom.removeAttribute("disabled");
    })

    gameClear();
}
/**
 *  ゲームクリア（ゲーム再スタート）
 */
function gameClear(){
    // 世代の確定
    const qRange = document.getElementById('qRange').value;

    // その世代の一覧を取得
    // ついでに文字列分割
    candidate = getPokemonListByRange(qRange)
    candidate.forEach(pokemon=>{
        const name = pokemon.name;
        const nameList = [];
        for (var i = 0; i < name.length; ++i) {
            nameList.push(name.charAt(i))
        }
        pokemon['char'] = nameList
    })

    if (option.useCalculatedStrongestPokemon) {
        // 初期ポケモンの選択
        const firstPokemonName = qRange == 0 ? "リザードン"
                            : qRange == 1 ? "キングラー"
                            : qRange == 2 ? "ジーランス"
                            : qRange == 7 ? "ジーランス"
                            : "レントラー"
        const firstPokemon = candidate.find(element => element.name == firstPokemonName);

        // 問題設定
        next(firstPokemon)
    }
    else {
        select()
    }
}
/**
 *  最有力候補だったポケモンに対する評価の清算
 */
function liquidation(){
    // 評価結果の取得
    const domList = getRadioDomList()
    const color = []
    domList.forEach(dom => {
        color.push(dom[0].checked ? 0 : dom[1].checked ? 1 : 2);
    })

    // 残りのポケモンのうちマッチするものすべてを選び出す
    const newCandidate = []
    candidate.forEach(pokemon=>{
        if (isMatch(bestProspect, pokemon ,color)){
            newCandidate.push(pokemon);
        }
    })
    candidate = newCandidate;

    select();
}
/**
 *  ギブアップ
 */
function giveUp(){
    // 世代選択を全て無効
    getRangeColumnDomList().forEach(dom=>{
        dom.removeAttribute("disabled");
    })

    // 回答欄を全て有効
    getAnswerColumnDomList().forEach(dom=>{
        dom.setAttribute("disabled", true);
    })
}
/**
 *  現在の候補集合から、次のポケモンを選出
 */
function select(){
    if (candidate.length == 0){
        const nameDoc = document.getElementById("name");
        nameDoc.style.color = "red";
        nameDoc.innerText = "候補がありません";
        return;
    }

    // 新しいポケモンの選択
    next(selectByLogically())
}
/**
 * 問題をセット
 */
function next(prospect){
    // ポケモンを登録
    bestProspect = prospect

    // 選択したポケモンを候補集合から削除
    const newCandidate = []
    candidate.forEach(pokemon=>{
        if (pokemon.name != bestProspect.name){
            newCandidate.push(pokemon) 
        }
    })
    candidate = newCandidate

    // 選択したポケモンの表示
    const nameDoc = document.getElementById("name");
    nameDoc.style.color = "black";
    nameDoc.innerText = bestProspect.name;
    const charDomList = getCharDomList();
    for(let i = 0; i < charDomList.length; i++){
        charDomList[i].innerText = bestProspect.char[i];
    }

    // ラジオボタンの状態の初期化
    const domList = getRadioDomList()
    domList.forEach(dom => {
        dom[0].checked = true;
    })
}
/**
 *  論理的に最適なポケモンの選択
 */
function selectByLogically(){
    const sortList = []
    candidate.forEach(pokemon=>{
        let exp = 0;
        for(let i = 0; i < 243; i++){
            const color = [
                i % 3,
                Math.floor(i / 3) % 3,
                Math.floor(i / 9) % 3,
                Math.floor(i / 27) % 3,
                Math.floor(i / 81) % 3
            ]
            let num = 0;
            candidate.forEach(pokemon2=>{
                if (isMatch(pokemon, pokemon2, color)) {
                    num += 1
                }
            })
            exp += (num / candidate.length) * num;
        }
        sortList.push({score : exp, name: pokemon.name, pokemon: pokemon});
    })

    // ソートしてソート結果をコンソールに出力
    sortList.sort((a, b) => { return (a.score < b.score) ? -1 : (a.score > b.score) ? 1 : 0 })
    console.log(sortList)

    // 最強のポケモンを返す
    return sortList[0].pokemon;
}
/**
 *  pokemonの評価がcolor[]だった場合、pokemon2がマッチするかどうかチェック
 */
function isMatch(pokemon, pokemon2, color){
    let point = 0;
    for(let j = 0; j < color.length; j++){
        // 灰色相当
        if (color[j] == 0){
            // この文字が使われていなければOK
            let diffPoint = 0
            for(let k = 0; k < color.length; k++){
                if (pokemon.char[j] != pokemon2.char[k]){
                    ++diffPoint;
                }
            }
            if (diffPoint == color.length){
                ++point;
            }
            // 使われていたとしても、
            // 自身の別indexで同文字が黄または緑ならOK
            else {
                for(let k = 0; k < color.length; k++){
                    if (pokemon.char[j] == pokemon.char[k] && color[k] != 0){
                        ++point;
                        break;
                    }
                }
            }
        }
        // 黄色相当
        else if (color[j] == 1) {
            if ((pokemon.char[j] == pokemon2.char[0]
            || pokemon.char[j] == pokemon2.char[1]
            || pokemon.char[j] == pokemon2.char[2]
            || pokemon.char[j] == pokemon2.char[3]
            || pokemon.char[j] == pokemon2.char[4])
            && pokemon.char[j] != pokemon2.char[j]){
            ++point;
            }
        }
        // 緑相当
        else{
            if (pokemon.char[j] == pokemon2.char[j]){
            ++point;
            }
        }
    }

    // すべての文字についてパターンに一致していれば合格
    return point == color.length
}
