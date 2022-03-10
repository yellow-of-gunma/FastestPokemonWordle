#coding: utf-8

#-ライブラリの読み込み-#
require 'open-uri'
require 'nokogiri'
require 'kconv'
require "rubygems"
require "csv"

#-メソッドの定義-#
#@brief  webサイトからポケモンのステータスのデータを取得する関数
#@param  d：解析したHTMLのデータ
# =>     path：表中の読み込む部分のパス
#@return 読み込みが完了したデータ
def load_data(d,path)
  data = []
  #図鑑ナンバー（全国図鑑）
  number = d.xpath(path + '/td[1]').text
  data.push(number)
  #ポケモン名
  name = d.xpath(path + '/td[2]').text
  if name.include?('(') then
    data.push(name.split('(')[0])
  else
    data.push(name)
  end
  #種族値それぞれ
  hp = d.xpath(path + '/td[3]').text
  data.push(hp)
  at = d.xpath(path + '/td[4]').text
  data.push(at)
  bl = d.xpath(path + '/td[5]').text
  data.push(bl)
  co = d.xpath(path + '/td[6]').text
  data.push(co)
  de = d.xpath(path + '/td[7]').text
  data.push(de)
  sp = d.xpath(path + '/td[8]').text
  data.push(sp)
  total = d.xpath(path + '/td[9]').text
  data.push(total)
  return data
end

# スクレイピング先のURL
#url = 'http://blog.game-de.com/pm-sm/sm-allstats/'
url = 'https://yakkun.com/swsh/stats_list.htm?mode=all'
#html = open(url, "r:binary").read
html = OpenURI.open_uri(url).read
doc = Nokogiri::HTML(html.toutf8, nil, 'utf-8')
# タイトルを表示
p doc.title
File.open('pokemon_status.txt','w', :encoding => "utf-8") do |poke|
  #ポケモンをステータスを1匹ずつ取得
  size = 1039
  #size=100
  lastPokemon = ""
  for i in 1..size do
    if i % 100 == 0 then#進行状況の表示
      puts i.to_s + "/" + size.to_s
    end
    path = '//tbody' + "/tr[#{i}]"
    status = load_data(doc,path)
    if status[1].length != 5  || lastPokemon == status[1] then
        next
    end
    lastPokemon = status[1]
    range = -1
    if status[0].to_i < 152 then
        range = 0
    elsif status[0].to_i < 252 then
        range = 1
    elsif status[0].to_i < 387 then
        range = 2
    elsif status[0].to_i < 495 then
        range = 3
    elsif status[0].to_i < 650 then
        range = 4
    elsif status[0].to_i < 722 then
        range = 5
    elsif status[0].to_i < 810 then
        range = 6
    elsif status[0].to_i < 898 then
        range = 7
    end
    printText = "\t"
    printText += '{ id: "' + status[0]
    printText += '", name: "' + status[1]
    printText += '", range: ' + range.to_s
    printText += ', hp: ' + status[2]
    printText += ', at: ' + status[3]
    printText += ', bl: ' + status[4]
    printText += ', co: ' + status[5]
    printText += ', de: ' + status[6]
    printText += ', sp: ' + status[7]
    printText += ', total: ' + status[8]
    printText += ' },'
    poke.puts(printText)#読み込んだデータをcsvファイルに保存
  end
end