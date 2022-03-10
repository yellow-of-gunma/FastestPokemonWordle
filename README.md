# POKEMON WORDLE最速回答プログラム
ポケモンWordleを数学的に最速で解くプログラムです
## 公開先
https://yellow-of-gunma.github.io/FastestPokemonWordle/
## 使い方
1. 世代を選択して「スタート」をクリック
2. 数学的に最強のポケモンが表示されるので、表示されたポケモンをWORDLEに入力
3. 得られた文字の色情報をラジオボタンで選択し「NEXT」をクリック
4. 2.へ戻る
## その他
- 開発者ツール（F12キー）のコンソールタブに、残りの候補ポケモンを数学的に強い順に表示しています
- 最初の1匹目の表示時だけは、その場での計算はしておらず、事前に計算しておいた数学的に最強のポケモンを表示しています（ポケモンの数が多くて、計算に数秒の時間がかかるため）。
  - 1匹目からその場で計算するバージョン
    - https://yellow-of-gunma.github.io/FastestPokemonWordle/develop.html 
## 参考文献
- ポケモンデータ取得のRubyコードは、以下を丸々参考にさせていただきました
  - https://rikapoke.hatenablog.jp/entry/pokemon_datasheet_gne7