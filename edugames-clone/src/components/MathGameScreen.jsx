import React, { useState, useEffect, useCallback } from 'react';

const englishQuestions = [
  { q: "How many letters are there in the English alphabet?", a: "26", o: ["24", "27", "26", "25"] },
  { q: "What is the opposite of 'hot'?", a: "cold", o: ["warm", "cold", "boiling", "ice"] },
  { q: "Which animal is the King of the Jungle?", a: "Lion", o: ["Tiger", "Lion", "Elephant", "Leopard"] },
  { q: "What color is a banana?", a: "Yellow", o: ["Red", "Yellow", "Green", "Blue"] },
  { q: "What is the plural of 'child'?", a: "children", o: ["childs", "children", "childrens", "childes"] },
  { q: "Which month comes after June?", a: "July", o: ["May", "July", "August", "April"] },
  { q: "What is the capital of the UK?", a: "London", o: ["Paris", "London", "New York", "Rome"] },
  { q: "Which day comes after Friday?", a: "Saturday", o: ["Sunday", "Saturday", "Thursday", "Monday"] },
  { q: "What do bees make?", a: "Honey", o: ["Milk", "Honey", "Sugar", "Juice"] },
  { q: "How many legs does a spider have?", a: "8", o: ["6", "8", "10", "4"] },
  { q: "Which of these is a fruit?", a: "Apple", o: ["Carrot", "Apple", "Potato", "Onion"] },
  { q: "What is the past tense of 'go'?", a: "went", o: ["went", "gone", "goes", "going"] },
  { q: "How many seasons are there in a year?", a: "4", o: ["3", "4", "12", "5"] },
  { q: "What is the opposite of 'big'?", a: "small", o: ["large", "small", "huge", "tall"] },
  { q: "Which of these is a vegetable?", a: "Cucumber", o: ["Orange", "Tomato", "Cucumber", "Peach"] }
];

const russianQuestions = [
  { q: "Множественное число слова «друг»?", a: "Друзья", o: ["Друзья", "Другов", "Друга", "Други"] },
  { q: "Какой союз?", a: "И", o: ["Красивый", "И", "Дом", "Читать"] },
  { q: "Найдите имя существительное:", a: "Книга", o: ["Книга", "Читать", "Красивый", "Быстро"] },
  { q: "Что из этого является глаголом?", a: "Бежать", o: ["Красивый", "Бежать", "Быстро", "Бег"] },
  { q: "Какое слово всегда пишется с большой буквы?", a: "Москва", o: ["Москва", "Город", "Улица", "Озеро"] },
  { q: "Антоним к слову «день»:", a: "Ночь", o: ["Утро", "Вечер", "Ночь", "Солнце"] },
  { q: "Синоним к слову «красивый»:", a: "Прекрасный", o: ["Умный", "Прекрасный", "Грустный", "Большой"] },
  { q: "Какое слово является предлогом?", a: "В", o: ["В", "И", "Но", "Что"] },
  { q: "Множественное число слова «человек»?", a: "Люди", o: ["Человеки", "Люди", "Народ", "Человек"] },
  { q: "Что лишнее?", a: "Яблоко", o: ["Собака", "Кошка", "Корова", "Яблоко"] },
  { q: "Сколько гласных букв в русском алфавите?", a: "10", o: ["6", "10", "33", "21"] },
  { q: "Какая буква идет после «М»?", a: "Н", o: ["Л", "Н", "О", "П"] },
  { q: "Женский род слова «ученик»:", a: "Ученица", o: ["Ученица", "Ученичка", "Ученик", "Ученицы"] },
  { q: "Слово с орфографической ошибкой:", a: "Молако", o: ["Молоко", "Собака", "Молако", "Корова"] },
  { q: "Что означает слово «алфавит»?", a: "Азбука", o: ["Азбука", "Книга", "Тетрадь", "Слово"] }
];

const motherQuestions = [
  { q: "Qaysi gapda son bor?", a: "Uch daftar", o: ["Men keldim", "Yaxshi bola", "U yugurdi", "Uch daftar"] },
  { q: "Qaysi so'z sifatga kiradi?", a: "Katta", o: ["Katta", "Biz", "O'qimoq", "Kitob"] },
  { q: "Ot so'z turkumiga kiruvchi so'zni toping:", a: "Maktab", o: ["O'qidi", "Chiroyli", "Maktab", "Tez"] },
  { q: "Fe'l turkumidagi so'zni aniqlang:", a: "Yozmoq", o: ["Yozmoq", "Daftar", "Yashil", "Besh"] },
  { q: "Kishilik olmoshini toping:", a: "Siz", o: ["Bu", "Siz", "Hamma", "Qachon"] },
  { q: "Qaysi so'z to'g'ri yozilgan?", a: "Xursand", o: ["Hursand", "Xursand", "Hursant", "Xursant"] },
  { q: "«Sariq» so'zi qaysi so'z turkumiga kiradi?", a: "Sifat", o: ["Ot", "Sifat", "Fe'l", "Son"] },
  { q: "Qaysi gap so'roq gap hisoblanadi?", a: "Bugun kelasizmi?", o: ["Dars boshlandi.", "Darsga keling!", "Bugun kelasizmi?", "Oh, qanday go'zal!"] },
  { q: "«Kitoblar» so'zidagi qo'shimcha qaysi?", a: "-lar", o: ["-ob", "-lar", "-ar", "-b"] },
  { q: "«Daraxt» so'zining ko'plik shaklini toping:", a: "Daraxtlar", o: ["Daraxtlar", "Daraxtcha", "Daraxtzor", "Daraxtni"] },
  { q: "O'zbek tili bayrami qaysi kuni nishonlanadi?", a: "21-oktyabr", o: ["21-oktyabr", "8-dekabr", "1-sentyabr", "21-mart"] },
  { q: "Qaysi biri undosh harf?", a: "B", o: ["A", "B", "O", "U"] },
  { q: "O'zbek alifbosida nechta harf bor?", a: "29", o: ["26", "29", "30", "32"] },
  { q: "Zid ma'noli so'zlar juftligini toping:", a: "Katta - kichik", o: ["Katta - ulkan", "Katta - kichik", "Qora - qorong'u", "Yaxshi - ajoyib"] },
  { q: "Qaysi gapda olmosh qatnashgan?", a: "Biz g'olib bo'ldik", o: ["Biz g'olib bo'ldik", "Dars boshlandi", "Chiroyli gul ochildi", "Tezroq yugur"] }
];

const biologyQuestions = [
  { q: "Biologiya fani nimani o'rganadi?", a: "Tirik organizmlarni", o: ["Jonsiz tabiatni", "Moddalarni", "Tirik organizmlarni", "Koinotni"] },
  { q: "Ovqat hazm qilish qayerda boshlanadi?", a: "Og'iz bo'shlig'ida", o: ["Qizilo'ngachda", "Oshqozonda", "Og'iz bo'shlig'ida", "Ichakda"] },
  { q: "Odam yuragi nechta bo'limdan iborat?", a: "4", o: ["3", "2", "5", "4"] },
  { q: "O'simliklar havoga qaysi gazni chiqaradi?", a: "Kislorod", o: ["Karbonat angidrid", "Azot", "Vodorod", "Kislorod"] },
  { q: "Tirik tabiatning eng kichik tarkibiy birligi nima?", a: "Hujayra", o: ["To'qima", "Hujayra", "Organ", "Molekula"] },
  { q: "Eng katta sutemizuvchi hayvon qaysi?", a: "Ko'k kit", o: ["Fil", "Ko'k kit", "Jirafa", "Akula"] },
  { q: "Fotosintez jarayoni o'simlikning qaysi qismida sodir bo'ladi?", a: "Bargida", o: ["Ildizida", "Poyasida", "Bargida", "Gulida"] },
  { q: "Inson tanasidagi eng katta organ qaysi?", a: "Teri", o: ["Jigar", "Yurak", "O'pka", "Teri"] },
  { q: "Qaysi vitamin quyosh nuri ta'sirida sintezlanadi?", a: "D vitamini", o: ["A vitamini", "C vitamini", "D vitamini", "B vitamini"] },
  { q: "Qaysi qush ucha olmaydi?", a: "Pingvin", o: ["Burgut", "Pingvin", "Qaldirg'och", "Laylak"] },
  { q: "Inson skeletida taxminan nechta suyak bor?", a: "206 ta", o: ["150 ta", "206 ta", "300 ta", "100 ta"] },
  { q: "Qon aylanish tizimining markaziy organi qaysi?", a: "Yurak", o: ["O'pka", "Miya", "Yurak", "Jigar"] },
  { q: "Baliqlar nima orqali nafas oladi?", a: "Jabra", o: ["O'pka", "Jabra", "Teri", "Traxeya"] },
  { q: "Asab tizimining asosiy hujayrasi qanday nomlanadi?", a: "Neyron", o: ["Neyron", "Eritrotsit", "Trombotsit", "Leykotsit"] },
  { q: "Inson tanasidagi qon guruhlari soni nechta?", a: "4 ta", o: ["3 ta", "4 ta", "5 ta", "2 ta"] }
];

const chemistryQuestions = [
  { q: "Temirning kimyoviy belgisi?", a: "Fe", o: ["T", "F", "Fe", "Ir"] },
  { q: "Oltinning kimyoviy belgisi?", a: "Au", o: ["Fe", "Ag", "Au", "Al"] },
  { q: "Suvning kimyoviy formulasi qanday?", a: "H2O", o: ["CO2", "H2O", "NaCl", "O2"] },
  { q: "Kislorodning kimyoviy belgisi nima?", a: "O", o: ["K", "Os", "Ox", "O"] },
  { q: "Karbonat angidrid gazining formulasi qanday?", a: "CO2", o: ["CO", "CO2", "C2O", "O2"] },
  { q: "Osh tuzining kimyoviy nomi va formulasi qanday?", a: "NaCl", o: ["HCl", "NaOH", "NaCl", "KCl"] },
  { q: "Vodorodning kimyoviy belgisi nima?", a: "H", o: ["V", "W", "H", "He"] },
  { q: "Azotning kimyoviy belgisi nima?", a: "N", o: ["A", "Az", "N", "Ni"] },
  { q: "Eng yengil kimyoviy element qaysi?", a: "Vodorod", o: ["Geliy", "Vodorod", "Kislorod", "Uglerod"] },
  { q: "Olmos va grafit qaysi elementning shakllaridir?", a: "Uglerod", o: ["Kremniy", "Uglerod", "Kislota", "Temir"] },
  { q: "Misning kimyoviy belgisi nima?", a: "Cu", o: ["Cu", "Co", "Cr", "Ca"] },
  { q: "Kalsiyning kimyoviy belgisi nima?", a: "Ca", o: ["K", "Ca", "Cl", "Cs"] },
  { q: "Kumushning kimyoviy belgisi nima?", a: "Ag", o: ["Au", "Ag", "Ar", "As"] },
  { q: "Kimyoviy elementlar davriy jadvalining yaratuvchisi kim?", a: "D. I. Mendeleyev", o: ["A. Nobel", "M. Kyuri", "D. I. Mendeleyev", "R. Boyl"] },
  { q: "Kislotali muhitni aniqlash uchun qaysi qog'oz ishlatiladi?", a: "Lakmus", o: ["Filtr qog'ozi", "Lakmus", "Oddiy qog'oz", "Indikator qog'ozi"] }
];

const physicsQuestions = [
  { q: "Bosim nima?", a: "Yuza birligiga ta'sir qiluvchi kuch", o: ["Massa", "Tezlik", "Energiya", "Yuza birligiga ta'sir qiluvchi kuch"] },
  { q: "Elektr toki nima?", a: "Zaryadlangan zarrachalar harakati", o: ["Zaryadlangan zarrachalar harakati", "Yorug'lik", "Bosim", "Issiqlik"] },
  { q: "Bosimning o'lchov birligi nima?", a: "Paskal", o: ["Nyuton", "Joul", "Paskal", "Vatt"] },
  { q: "Kuchning o'lchov birligi nima?", a: "Nyuton", o: ["Klogram", "Nyuton", "Vatt", "Volt"] },
  { q: "Tezlikning formulasi qaysi?", a: "v = s / t", o: ["v = s * t", "v = s / t", "v = a * t", "v = m / V"] },
  { q: "Yerning tortishish kuchi tezlanishi (g) taxminan nechaga teng?", a: "9.8 m/s²", o: ["9.8 m/s²", "10.5 m/s²", "8.9 m/s²", "1.6 m/s²"] },
  { q: "Tok kuchining o'lchov birligi nima?", a: "Amper", o: ["Volt", "Om", "Amper", "Farad"] },
  { q: "Om qonunining formulasi qaysi?", a: "I = U / R", o: ["I = U * R", "I = U / R", "U = I / R", "R = I / U"] },
  { q: "Yorug'lik tezligi vakuumda taxminan nechaga teng?", a: "300 000 km/s", o: ["150 000 km/s", "300 000 km/s", "500 000 km/s", "1 000 km/s"] },
  { q: "Energiya va ishning o'lchov birligi nima?", a: "Joul", o: ["Joul", "Nyuton", "Paskal", "Vatt"] },
  { q: "Zichlikning o'lchov birligi qaysi?", a: "kg/m³", o: ["g/cm", "kg/m³", "N/m²", "J/s"] },
  { q: "Qaysi kuch jismning harakatiga qarshi yo'nalgan bo'ladi?", a: "Ishqalanish kuchi", o: ["Og'irlik kuchi", "Arximed kuchi", "Ishqalanish kuchi", "Taranglik kuchi"] },
  { q: "Suyuqlikdagi jismga ta'sir qiluvchi itarib chiquvchi kuch qanday nomlanadi?", a: "Arximed kuchi", o: ["Arximed kuchi", "Nyuton kuchi", "Kulon kuchi", "Lorents kuchi"] },
  { q: "Kuchlanishning o'lchov birligi nima?", a: "Volt", o: ["Amper", "Om", "Volt", "Vatt"] },
  { q: "Issiqlik miqdorining birligi nima?", a: "Joul", o: ["Kelvin", "Selsiy", "Joul", "Kaloriya"] },
  { q: "Jismga berilgan kuch bilan uning olgan tezlanishi orasidagi bog'liqlikni ifodalovchi qonun qaysi?", a: "Nyutonning 2-qonuni", o: ["Nyutonning 1-qonuni", "Nyutonning 2-qonuni", "Nyutonning 3-qonuni", "Butunjahon tortishish qonuni"] },
  { q: "Haroratni o'lchaydigan asbob nima deb ataladi?", a: "Termometr", o: ["Barometr", "Termometr", "Manometr", "Dinamometr"] },
  { q: "Atmosfera bosimini o'lchaydigan asbob nima deb ataladi?", a: "Barometr", o: ["Barometr", "Manometr", "Termometr", "Gidrometr"] },
  { q: "Kuchni o'lchaydigan asbob nima deb ataladi?", a: "Dinamometr", o: ["Akkumulyator", "Barometr", "Dinamometr", "Voltmetr"] },
  { q: "Mexanik ishning formulasi qaysi?", a: "A = F * s", o: ["A = F * s", "A = F / s", "A = m * g", "A = E / t"] },
  { q: "Jismning massasi bilan tezligi ko'paytmasiga teng bo'lgan kattalik nima deb ataladi?", a: "Impuls", o: ["Kuch", "Impuls", "Energiya", "Bosim"] },
  { q: "Moddaning uchta agregat holatidan biri bo'lmaganini toping:", a: "Vakuum", o: ["Qattiq", "Suyuq", "Gaz", "Vakuum"] },
  { q: "Elektr qarshiligining o'lchov birligi nima?", a: "Om", o: ["Volt", "Om", "Amper", "Farad"] },
  { q: "Elektr zaryadining o'lchov birligi nima?", a: "Kulon", o: ["Kulon", "Amper", "Joul", "Farad"] },
  { q: "Jismning inertlik xossasini xarakterlovchi kattalik nima?", a: "Massa", o: ["Og'irlik", "Massa", "Zichlik", "Hajm"] },
  { q: "Gidravlik press qaysi qonunga asoslanib ishlaydi?", a: "Paskal qonuniga", o: ["Arximed qonuniga", "Paskal qonuniga", "Nyuton qonuniga", "Om qonuniga"] },
  { q: "Tok kuchini o'lchaydigan asbob nima?", a: "Ampermetr", o: ["Voltmetr", "Ampermetr", "Ommetr", "Barometr"] },
  { q: "Kuchlanishni o'lchaydigan asbob nima?", a: "Voltmetr", o: ["Voltmetr", "Ampermetr", "Dinamometr", "Termometr"] },
  { q: "Jismning harakati davomida saqlab qoladigan energiyasi (harakat energiyasi) nima deb ataladi?", a: "Kinetik energiya", o: ["Potensial energiya", "Kinetik energiya", "Ichki energiya", "Kimyoviy energiya"] },
  { q: "Tinch holatdagi yoki ma'lum balandlikdagi jismning energiyasi nima deb ataladi?", a: "Potensial energiya", o: ["Kinetik energiya", "Potensial energiya", "Issiqlik energiyasi", "Yadro energiyasi"] }
];

const historyQuestions = [
  { q: "Amir Temur nechanchi yilda tug'ilgan?", a: "1336-yil", o: ["1336-yil", "1346-yil", "1326-yil", "1356-yil"] },
  { q: "Alisher Navoiy nechanchi yilda tug'ilgan?", a: "1441-yil", o: ["1441-yil", "1431-yil", "1451-yil", "1461-yil"] },
  { q: "O'zbekiston mustaqilligi qaysi yilda e'lon qilingan?", a: "1991-yil", o: ["1990-yil", "1991-yil", "1992-yil", "1993-yil"] },
  { q: "Amir Temurning poytaxti qaysi shahar bo'lgan?", a: "Samarqand", o: ["Buxoro", "Toshkent", "Samarqand", "Xiva"] },
  { q: "Buyuk ipak yo'li qaysi asrlarda gullab-yashnagan?", a: "Miloddan avvalgi II asr - milodiy XV asr", o: ["X-XV asrlar", "Miloddan avvalgi II asr - milodiy XV asr", "V-X asrlar", "XV-XX asrlar"] },
  { q: "Jaloliddin Manguberdi qaysi sulolaga mansub bo'lgan?", a: "Anushteginiylar (Xorazmshohlar)", o: ["Temuriylar", "Somoniylar", "Anushteginiylar (Xorazmshohlar)", "Qoraxoniylar"] },
  { q: "Mirzo Ulug'bek kim bo'lgan?", a: "Astronom va hukmdor", o: ["Shoir", "Astronom va hukmdor", "Tabib", "Rassom"] },
  { q: "Qadimgi Xorazm davlati poytaxtlaridan birini toping:", a: "Kat", o: ["Toshkent", "Samarqand", "Buxoro", "Kat"] },
  { q: "Zahiriddin Muhammad Bobur qayerda shohlik qilgan va Boburiylar sulolasiga asos solgan?", a: "Hindistonda", o: ["Eronda", "Hindistonda", "Turkiyada", "Xitoyda"] },
  { q: "Buxoro amirligi qaysi yilda tugatilgan?", a: "1920-yil", o: ["1917-yil", "1920-yil", "1924-yil", "1868-yil"] },
  { q: "O'zbekiston Respublikasi Konstitutsiyasi qachon qabul qilingan?", a: "1992-yil 8-dekabr", o: ["1991-yil 31-avgust", "1992-yil 8-dekabr", "1993-yil 2-iyul", "1990-yil 20-iyun"] },
  { q: "Avesto kitobi qaysi dinga tegishli?", a: "Zardushtiylik", o: ["Islom", "Buddaviylik", "Zardushtiylik", "Nasroniylik"] },
  { q: "Abu Ali ibn Sino qaysi sohada jahonga mashhur bo'lgan?", a: "Tibbiyot", o: ["Astronomiya", "Matematika", "Tibbiyot", "Kimyo"] },
  { q: "O'zbek romanchiligining asoschisi kim?", a: "Abdulla Qodiriy", o: ["Cho'lpon", "Fitrat", "Abdulla Qodiriy", "G'afur G'ulom"] },
  { q: "Toshkent shahri nechanchi yilda 2200 yilligini nishonladi?", a: "2009-yil", o: ["2000-yil", "2005-yil", "2009-yil", "2012-yil"] },
  { q: "Amir Temur qaysi jangda To'xtamishxonni mag'lub etgan?", a: "Terek jangi", o: ["G'ijduvon jangi", "Terek jangi", "Anqara jangi", "Loy jangi"] },
  { q: "Samarqanddagi Registon maydonida joyhazgan eng birinchi madrasa qaysi?", a: "Ulug'bek madrasasi", o: ["Sherdor madrasasi", "Tilla-Kori madrasasi", "Ulug'bek madrasasi", "Mirzo madrasasi"] },
  { q: "O'zbekiston Respublikasi Davlat bayrog'i qachon qabul qilingan?", a: "1991-yil 18-noyabr", o: ["1991-yil 31-avgust", "1991-yil 18-noyabr", "1992-yil 2-iyul", "1992-yil 8-dekabr"] },
  { q: "Jaloliddin Manguberdi Chingizxon qo'shiniga qarshi qaysi jangda g'alaba qozongan?", a: "Parvon jangi", o: ["Parvon jangi", "Sind daryosi bo'yidagi jang", "Loy jangi", "Samarqand mudofaasi"] },
  { q: "Qadimgi Yunoniston tarixchisi, 'Tarix otasi' deb ataladigan shaxs kim?", a: "Gerodot", o: ["Sokrat", "Gerodot", "Platon", "Aristotel"] },
  { q: "Ikkinchi jahon urushi nechanchi yillarda bo'lib o'tgan?", a: "1939-1945-yillar", o: ["1914-1918-yillar", "1939-1945-yillar", "1941-1945-yillar", "1917-1922-yillar"] },
  { q: "O'zbekiston hududida qaysi dengiz joylashgan?", a: "Orol dengizi", o: ["Qora dengiz", "Boltiq dengizi", "Kaspiy", "Orol dengizi"] },
  { q: "O'zbekiston mustaqilligi qaysi oyda e'lon qilingan?", a: "Avgust", o: ["Sentyabr", "Avgust", "Dekabr", "Oktyabr"] },
  { q: "Amir Temurning otasining ismi nima edi?", a: "Amir Tarag'ay", o: ["Amir Temurmalik", "Amir Tarag'ay", "Amir Qorachor", "Amir Chogu"] },
  { q: "Boburnoma asari kim tomonidan yozilgan?", a: "Zahiriddin Muhammad Bobur", o: ["Alisher Navoiy", "Zahiriddin Muhammad Bobur", "Mirzo Ulug'bek", "Abulg'ozi Bahodirxon"] },
  { q: "Qaysi hukmdor Samarqandda rasadxona (observatoriya) qurdirgan?", a: "Mirzo Ulug'bek", o: ["Amir Temur", "Mirzo Ulug'bek", "Shohrux Mirzo", "Boysunqur Mirzo"] },
  { q: "Somoniylar davlatining asoschisi kim?", a: "Ismoil Somoniy", o: ["Ismoil Somoniy", "Nasr ibn Ahmad", "Nuh ibn Mansur", "Alp Tegin"] },
  { q: "G'aznaviylar davlatining eng mashhur hukmdori kim bo'lgan?", a: "Mahmud G'aznaviy", o: ["Alp Tegin", "Subuktegin", "Mahmud G'aznaviy", "Mas'ud G'aznaviy"] },
  { q: "Qoraxoniylar davlatida islom dini davlat dini deb qachon e'lon qilingan?", a: "960-yil", o: ["960-yil", "1000-yil", "900-yil", "999-yil"] },
  { q: "O'zbekiston Respublikasi Davlat gerbi qachon qabul qilingan?", a: "1992-yil 2-iyul", o: ["1991-yil 18-noyabr", "1992-yil 2-iyul", "1992-yil 8-dekabr", "1993-yil 10-dekabr"] }
];

const geographyQuestions = [
  { q: "Atmosfera bosimi qaysi asbob bilan o'lchanadi?", a: "Barometr", o: ["Anemometr", "Gidrometr", "Kompas", "Barometr"] },
  { q: "Farg'ona vodiysi qaysi yo'nalishda cho'zilgan?", a: "G'arbdan sharqqa", o: ["Sharqdan g'arbga", "Janubdan shimolga", "Shimoldan janubga", "G'arbdan sharqqa"] },
  { q: "Yer sharida nechta materik (qit'a) bor?", a: "6 ta", o: ["5 ta", "6 ta", "7 ta", "8 ta"] },
  { q: "Dunyodagi eng uzun daryo qaysi?", a: "Nil", o: ["Amazonka", "Nil", "Missisipi", "Yanszi"] },
  { q: "Dunyoning eng baland cho'qqisi qaysi?", a: "Everest (Jomolungma)", o: ["K2", "Everest (Jomolungma)", "Kanlay", "Monblan"] },
  { q: "Yer sharidagi eng katta okean qaysi?", a: "Tinch okeani", o: ["Atlantika okeani", "Hind okeani", "Tinch okeani", "Shimoliy muz okeani"] },
  { q: "O'zbekistonning poytaxti qaysi shahar?", a: "Toshkent", o: ["Samarqand", "Buxoro", "Toshkent", "Namangan"] },
  { q: "O'zbekiston Respublikasi qaysi davlatlar bilan chegaradosh?", a: "Qozog'iston, Qirg'iziston, Tojikiston, Afg'oniston, Turkmaniston", o: ["Rusiya, Xitoy, Qozog'iston", "Eron, Afg'oniston, Pokiston", "Qozog'iston, Qirg'iziston, Tojikiston, Afg'oniston, Turkmaniston", "Turkiya, Ozarbayjon, Gruziya"] },
  { q: "Dunyodagi eng chuqur ko'l qaysi?", a: "Baykal", o: ["Kaspiy dengizi", "Orol dengizi", "Viktoriya", "Baykal"] },
  { q: "Qaysi chiziq Yer sharini Shimoliy va Janubiy yarimsharlarga ajratib turadi?", a: "Ekvator", o: ["Meridian", "Parallel", "Ekvator", "Tropik chiziq"] },
  { q: "Dunyodagi eng katta cho'l qaysi?", a: "Saxora", o: ["Qizilqum", "Gobi", "Saxora", "Kalahari"] },
  { q: "O'zbekistondagi eng katta cho'l qaysi?", a: "Qizilqum", o: ["Qoraqum", "Qizilqum", "Ustyurt", "Mirzacho'l"] },
  { q: "Markaziy Osiyodagi eng sersuv va yirik daryo qaysi?", a: "Amudaryo", o: ["Sirdaryo", "Amudaryo", "Zarafshon", "Surxondaryo"] },
  { q: "Eng kichik materik qaysi?", a: "Avstraliya", o: ["Antarktida", "Avstraliya", "Janubiy Amerika", "Yevropa"] },
  { q: "Dunyoning eng katta oroli qaysi?", a: "Grenlandiya", o: ["Madagaskar", "Grenlandiya", "Yangi Gvineya", "Kalimantan"] },
  { q: "Yaponiya davlatining poytaxti qaysi shahar?", a: "Tokio", o: ["Pekin", "Seul", "Tokio", "Kioto"] },
  { q: "Italiya davlatining poytaxti qaysi shahar?", a: "Rim", o: ["Rim", "Milan", "Venetsiya", "Parij"] },
  { q: "O'zbekistonda nechta viloyat bor?", a: "12 ta viloyat va 1 ta respublika", o: ["10 ta", "12 ta viloyat va 1 ta respublika", "14 ta", "11 ta"] },
  { q: "Kompasning ko'k mili qaysi tomonni ko'rsatadi?", a: "Shimol", o: ["Janub", "Shimol", "Sharq", "G'arb"] },
  { q: "Yer yuzida nechta okean bor?", a: "5 ta", o: ["3 ta", "4 ta", "5 ta", "6 ta"] },
  { q: "Misr (Egipt) davlati qaysi qit'ada joylashgan?", a: "Afrika", o: ["Osiyo", "Yevropa", "Afrika", "Amerika"] },
  { q: "Maydoni bo'yicha dunyodagi eng katta davlat qaysi?", a: "Rossiya", o: ["Kanada", "Xitoy", "AQSh", "Rossiya"] },
  { q: "Geografik xaritada suv havzalari (okean, dengiz, ko'l) qaysi rangda tasvirlanadi?", a: "Ko'k", o: ["Yashil", "Jigarrang", "Sariq", "Ko'k"] },
  { q: "Xaritada tog'lar qaysi rangda tasvirlanadi?", a: "Jigarrang", o: ["Yashil", "Jigarrang", "Ko'k", "Sariq"] },
  { q: "Qaysi mamlakat 'Kunchiqar yurt' deb ataladi?", a: "Yaponiya", o: ["Xitoy", "Koreya", "Yaponiya", "Vetnam"] },
  { q: "O'zbekistonning eng baland cho'qqisi qaysi va uning balandligi qancha?", a: "Hazrati Sulton cho'qqisi (4643 m)", o: ["Adelunga (4301 m)", "Beshtor (4299 m)", "Hazrati Sulton cho'qqisi (4643 m)", "Katta Chimyon (3309 m)"] },
  { q: "Dunyoning eng baland sharsharasi qaysi?", a: "Anxel", o: ["Niagara", "Viktoriya", "Anxel", "Iguasu"] },
  { q: "Eng sho'r dengiz (yoki ko'l) qaysi?", a: "O'lik dengizi", o: ["Qizil dengiz", "O'lik dengizi", "Orol dengizi", "Kaspiy dengizi"] },
  { q: "Avstraliyaning poytaxti qaysi shahar?", a: "Kanberra", o: ["Sidney", "Melburn", "Kanberra", "Brisben"] },
  { q: "Yevropadagi eng uzun daryo qaysi?", a: "Volga", o: ["Dunay", "Volga", "Dneprd", "Reyn"] }
];

const informaticsQuestions = [
  { q: "Faylni saqlash tugmasi?", a: "Save", o: ["Save", "Close", "Open", "Edit"] },
  { q: "Ma'lumot kiritish qurilmasi qaysi?", a: "Klaviatura", o: ["Karnay", "Printer", "Monitor", "Klaviatura"] },
  { q: "Kompilyator nima vazifani bajaradi?", a: "Dasturlash tilidagi kodni mashina kodiga o'tkazadi", o: ["Matn tahrirlash", "Dasturlash tilidagi kodni mashina kodiga o'tkazadi", "Faylni arxivlaydi", "Internetga ulanadi"] },
  { q: "1 Kilobayt (KB) nechta baytga teng?", a: "1024 bayt", o: ["1000 bayt", "1024 bayt", "512 bayt", "2048 bayt"] },
  { q: "Katta hajmdagi ma'lumotlarni saqlash va tartibga solish tizimi nima deb ataladi?", a: "Ma'lumotlar bazasi (Database)", o: ["Operatsion tizim", "Fayl menejeri", "Ma'lumotlar bazasi (Database)", "Brauzer"] },
  { q: "HTML nima?", a: "Hujjatlarni belgilash tili", o: ["Dasturlash tili", "Operatsion tizim", "Hujjatlarni belgilash tili", "Ma'lumotlar bazasi"] },
  { q: "Kompyuterning miyasi deb hisoblanadigan eng asosiy mikrosxema qaysi?", a: "Protsessor (CPU)", o: ["Tezkor xotira (RAM)", "Protsessor (CPU)", "Videokarta (GPU)", "Ona plata"] },
  { q: "Quyidagilardan qaysi biri operatsion tizim emas?", a: "Google Chrome", o: ["Windows", "Linux", "macOS", "Google Chrome"] },
  { q: "Dasturlashda o'zgaruvchi (variable) nima?", a: "Ma'lumot saqlanadigan joy (adresli yacheyka)", o: ["Matematik formula", "Ma'lumot saqlanadigan joy (adresli yacheyka)", "Xatoliklar ro'yxati", "Dastur kodi"] },
  { q: "Quyidagilardan qaysi biri dasturlash tili hisoblanadi?", a: "Python", o: ["Microsoft Word", "Python", "Google Chrome", "Adobe Photoshop"] },
  { q: "Internet tarmog'idagi sahifalarni ochish uchun mo'ljallangan dastur nima deb ataladi?", a: "Brauzer", o: ["Matn tahrirlovchi", "Kompilyator", "Brauzer", "Antivirus"] },
  { q: "RAM (Tezkor xotira) nima?", a: "Vaqtinchalik tezkor xotira", o: ["Doimiy xotira", "Tashqi xotira", "Vaqtinchalik tezkor xotira", "Arxiv xotira"] },
  { q: "Axborotning eng kichik o'lchov birligi nima?", a: "Bit", o: ["Bayt", "Kilobayt", "Bit", "Megabayt"] },
  { q: "1 Bayt nechta bitga teng?", a: "8 bit", o: ["4 bit", "8 bit", "16 bit", "32 bit"] },
  { q: "CSS nima vazifani bajaradi?", a: "Veb-sahifani bezatish (dizayn berish)", o: ["Ma'lumotlar bazasini boshqarish", "Veb-sahifani bezatish (dizayn berish)", "Algoritm yozish", "Kompyuterni himoya qilish"] },
  { q: "WWW qisqartmasining to'liq shakli qaysi?", a: "World Wide Web", o: ["Wide World Web", "World Wide Web", "World Web Wide", "World Width Web"] },
  { q: "Kompyuterni viruslardan himoya qiluvchi dastur qanday ataladi?", a: "Antivirus", o: ["Brauzer", "Utilit", "Drayver", "Antivirus"] },
  { q: "Elektron pochta manzilida qaysi belgi majburiy hisoblanadi?", a: "@", o: ["#", "$", "@", "&"] },
  { q: "Kompyuterdagi o'chirilgan fayllar vaqtincha qayerga borib tushadi?", a: "Savatcha (Recycle Bin)", o: ["Mening hujjatlarim", "Savatcha (Recycle Bin)", "Tezkor xotira", "Boshqaruv paneli"] },
  { q: "Qaysi algoritm takrorlanuvchi jarayonlarni ifodalash uchun ishlatiladi?", a: "Siklik algoritm", o: ["Chiziqli algoritm", "Tarmoqlanuvchi algoritm", "Siklik algoritm", "Arxiv algoritm"] },
  { q: "Dasturdagi xatoliklarni topish va bartaraf etish jarayoni nima deb ataladi?", a: "Nosozliklarni tuzatish (Debugging)", o: ["Kompilyatsiya", "Arxivlash", "Nosozliklarni tuzatish (Debugging)", "Skanerlash"] },
  { q: "IP-manzil nima?", a: "Tarmoqdagi qurilmaning noyob raqamli manzili", o: ["Dasturlash tili nomi", "Tarmoqdagi qurilmaning noyob raqamli manzili", "Brauzer turi", "Fayl formati"] },
  { q: "Quyidagi fayl kengaytmalari ichidan rasm formatini toping:", a: ".jpg", o: [".exe", ".mp3", ".docx", ".jpg"] },
  { q: "Quyidagi fayl kengaytmalari ichidan matnli hujjat formatini toping:", a: ".docx", o: [".docx", ".mp4", ".zip", ".jpg"] },
  { q: "Quyidagi fayl kengaytmalari ichidan dasturning ishga tushirish faylini toping:", a: ".exe", o: [".txt", ".exe", ".pdf", ".png"] },
  { q: "Algoritm nima?", a: "Masalani hal qilish uchun bajariladigan ketma-ketliklar tizimi", o: ["Kompyuter qurilmasi", "Masalani hal qilish uchun bajariladigan ketma-ketliklar tizimi", "Dasturlash tili turi", "Grafik rasm"] },
  { q: "Axborotni uzatish va qabul qilish qurilmasi qaysi?", a: "Modem", o: ["Printer", "Skaner", "Modem", "Klaviatura"] },
  { q: "Kompyuterdagi ma'lumotlarni qog'ozga chop etish qurilmasi qaysi?", a: "Printer", o: ["Skaner", "Printer", "Monitor", "Klaviatura"] },
  { q: "Qog'ozdagi matn yoki rasmni kompyuter xotirasiga kirituvchi qurilma qaysi?", a: "Skaner", o: ["Printer", "Skaner", "Karnay", "Proyektor"] },
  { q: "URL nima?", a: "Veb-sahifaning tarmoqdagi manzili (havolasi)", o: ["Operatsion tizim nomi", "Veb-sahifaning tarmoqdagi manzili (havolasi)", "Fayl o'lchovi", "Matn tahrirlovchi"] }
];

const literatureQuestions = [
  { q: "Boburning mashhur asari qaysi?", a: "Boburnoma", o: ["Devon", "Qissa", "Boburnoma", "Xamsa"] },
  { q: "Abdulla Oripov qaysi asar bilan mashhur?", a: "O'zbekiston", o: ["Boburnoma", "Alpomish", "O'zbekiston", "Navoiy"] },
  { q: "O'zbek adabiyoti tarixida birinchi roman janriga asos solgan asar qaysi?", a: "O'tkan kunlar", o: ["O'tkan kunlar", "Mehrobdan chayon", "Kecha va kunduz", "Qutlug' qon"] },
  { q: "O'tkan kunlar romani muallifi kim?", a: "Abdulla Qodiriy", o: ["Cho'lpon", "Fitrat", "Abdulla Qodiriy", "Oybek"] },
  { q: "G'azal mulkining sultoni deb qaysi ulug' shoir e'tirof etiladi?", a: "Alisher Navoiy", o: ["Bobur", "Alisher Navoiy", "Lutfiy", "Fuzuliy"] },
  { q: "Alisher Navoiy yozgan besh doston to'plami qanday nomlanadi?", a: "Xamsa", o: ["Devon", "Xamsa", "Chor devon", "Qissa"] },
  { q: "Alisher Navoyining birinchi dostoni qaysi?", a: "Hayratul-abror", o: ["Farhod va Shirin", "Layli va Majnun", "Hayratul-abror", "Saddi Iskandariy"] },
  { q: "Kecha va kunduz romani muallifi kim?", a: "Abdulhamid Cho'lpon", o: ["Abdulla Qodiriy", "Abdulhamid Cho'lpon", "Oybek", "Hamid Olimjon"] },
  { q: "Qutlug' qon romani muallifi kim?", a: "Oybek (Muso Toshmuhammad o'g'li)", o: ["Oybek (Muso Toshmuhammad o'g'li)", "G'afur G'ulom", "Abdulla Qahhor", "Omon Muxtor"] },
  { q: "Zaynib va Omon dostonining muallifi kim?", a: "Hamid Olimjon", o: ["G'afur G'ulom", "Hamid Olimjon", "Zulfiya", "Mirtemir"] },
  { q: "O'zbek xalq qahramonlik eposi qaysi?", a: "Alpomish", o: ["Go'rog'li", "Alpomish", "Rustamxon", "Kuntug'mish"] },
  { q: "Shum bola qissasining muallifi kim?", a: "G'afur G'ulom", o: ["Abdulla Qahhor", "G'afur G'ulom", "Said Ahmad", "Erkin Vohidov"] },
  { q: "Sariq devni minib sarguzasht romani muallifi kim?", a: "Xudoyberdi To'xtaboyev", o: ["Anvar Obidjon", "Xudoyberdi To'xtaboyev", "G'afur G'ulom", "Said Ahmad"] },
  { q: "O'zbekiston Qahramoni, O'zbegim qasidasi muallifi bo'lgan buyuk shoir kim?", a: "Erkin Vohidov", o: ["Erkin Vohidov", "Abdulla Oripov", "Halima Xudoyberdiyeva", "Shuhrat"] },
  { q: "Dunyoning ishlari qissasi muallifi kim?", a: "O'tkir Hoshimov", o: ["O'tkir Hoshimov", "Said Ahmad", "Tohir Malik", "Shukur Xolmirzayev"] },
  { q: "O'zbek detektiv adabiyoti asoschisi, Shaytanat asari muallifi kim?", a: "Tohir Malik", o: ["O'tkir Hoshimov", "Tohir Malik", "Said Ahmad", "Pirimqul Qodirov"] },
  { q: "Yulduzli tunlar romani kim haqida va uning muallifi kim?", a: "Bobur haqida, Pirimqul Qodirov", o: ["Amir Temur haqida, Pirimqul Qodirov", "Bobur haqida, Pirimqul Qodirov", "Ulug'bek haqida, Odil Yoqubov", "Navoiy haqida, Oybek"] },
  { q: "Ulug'bek xazinasi romani muallifi kim?", a: "Odil Yoqubov", o: ["Pirimqul Qodirov", "Odil Yoqubov", "Oybek", "Asqad Muxtor"] },
  { q: "O'zbek xalq dostonlari orasida ishqiy-afsonaviy dostonni toping:", a: "Kuntug'mish", o: ["Alpomish", "Yodgor", "Kuntug'mish", "Go'rog'li"] },
  { q: "Zulfiyaning vafot etgan turmush o'rtog'iga bag'ishlab yozgan mashhur she'ri qaysi?", a: "Bahor keldi seni so'roqlab", o: ["Bahor keldi seni so'roqlab", "Lola", "O'g'lim, sira bo'lmaydi urush", "Sadoqat"] },
  { q: "Mehrobdan chayon romani qaysi yozuvchi qalamiga mansub?", a: "Abdulla Qodiriy", o: ["Abdulla Qodiriy", "Oybek", "Cho'lpon", "Hamza"] },
  { q: "Daftar chetidagi bitiklar asari muallifi kim?", a: "Abdulla Oripov", o: ["Erkin Vohidov", "Abdulla Oripov", "Zulfiya", "Halima Xudoyberdiyeva"] },
  { q: "Ufq trilogiyasi muallifi bo'lgan mashhur yozuvchi kim?", a: "Said Ahmad", o: ["Said Ahmad", "O'tkir Hoshimov", "Abdulla Qahhor", "Odil Yoqubov"] },
  { q: "Anor hikoyasi muallifi kim?", a: "Abdulla Qahhor", o: ["Abdulla Qahhor", "Said Ahmad", "Oybek", "G'afur G'ulom"] },
  { q: "Lisonut-tayr dostonining muallifi kim?", a: "Alisher Navoiy", o: ["Fuzuliy", "Alisher Navoiy", "Lutfiy", "Bobur"] },
  { q: "Navoiy romani muallifi kim?", a: "Oybek", o: ["G'afur G'ulom", "Oybek", "Abdulla Qahhor", "Said Ahmad"] },
  { q: "Muqaddas ayol she'ri muallifi kim?", a: "Halima Xudoyberdiyeva", o: ["Zulfiya", "Halima Xudoyberdiyeva", "Oydin", "Saida Zunnunova"] },
  { q: "Qadimgi turkiy adabiyotning yirik yodgorligi bo'lmish Devonu lug'otit turk muallifi kim?", a: "Mahmud Qoshg'ariy", o: ["Yusuf Xos Hojib", "Mahmud Qoshg'ariy", "Ahmad Yassaviy", "Ahmad Yugnakiy"] },
  { q: "Qutadg'u bilig (Saodatga yo'llovchi bilim) asari muallifi kim?", a: "Yusuf Xos Hojib", o: ["Yusuf Xos Hojib", "Mahmud Qoshg'ariy", "Ahmad Yassaviy", "Alisher Navoiy"] },
  { q: "Hikmatlar (Devoni Hikmat) muallifi kim?", a: "Xoja Ahmad Yassaviy", o: ["Bahouddin Naqshband", "Xoja Ahmad Yassaviy", "Alisher Navoiy", "Jaloliddin Rumiy"] }
];

const turkishQuestions = [
  { q: "\"Okul\" so'zi nimani bildiradi?", a: "Maktab", o: ["Bog'cha", "Maktab", "Do'kon", "Universitet"] },
  { q: "\"Merhaba\" so'zining ma'nosi nima?", a: "Salom", o: ["Kechirasiz", "Xayr", "Salom", "Rahmat"] },
  { q: "Turk tilida \"Teşekkür ederim\" nimani bildiradi?", a: "Rahmat", o: ["Salom", "Xayr", "Rahmat", "Kechirasiz"] },
  { q: "Turk tilida \"Görüşürüz\" nimani bildiradi?", a: "Ko'rishguncha", o: ["Salom", "Xayr", "Ko'rishguncha", "Xush kelibsiz"] },
  { q: "Turk tilida \"Evet\" va \"Hayır\" so'zlari nimani bildiradi?", a: "Ha va Yo'q", o: ["Ha va Yo'q", "Rahmat va Kechirasiz", "Salom va Xayr", "Katta va Kichik"] },
  { q: "\"Lütfen\" so'zining ma'nosi nima?", a: "Iltimos", o: ["Rahmat", "Iltimos", "Kechirasiz", "Salom"] },
  { q: "\"Nasılsın?\" so'rog'iga qanday javob beriladi?", a: "İyiyim", o: ["Günaydın", "İyiyim", "Hoşça kal", "Merhaba"] },
  { q: "\"Günaydın\" so'zi qachon ishlatiladi?", a: "Ertalab (Xayrli tong)", o: ["Kechqurun", "Ertalab (Xayrli tong)", "Tushlikda", "Uxlashdan oldin"] },
  { q: "\"İyi geceler\" iborasi nimani anglatadi?", a: "Xayrli tun", o: ["Xayrli kun", "Xayrli tun", "Xayrli kech", "Xayrli tong"] },
  { q: "Turk tilida \"Kitap\" so'zining ko'plik shakli qaysi?", a: "Kitaplar", o: ["Kitaplar", "Kitapler", "Kitaplarim", "Kitaplariniz"] },
  { q: "\"Kalem\" so'zining o'zbekcha tarjimasi nima?", a: "Qalam", o: ["Daftar", "Qalam", "Kitob", "O'chirg'ich"] },
  { q: "\"Elma\" qaysi meva?", a: "Olma", o: ["Uzum", "Olma", "Anor", "Banan"] },
  { q: "\"Kırmızı\" qaysi rang?", a: "Qizil", o: ["Ko'k", "Yashil", "Sariq", "Qizil"] },
  { q: "\"Sarı\" qaysi rang?", a: "Sariq", o: ["Qora", "Oq", "Sariq", "Ko'k"] },
  { q: "\"Yeşil\" qaysi rang?", a: "Yashil", o: ["Yashil", "Qizil", "Ko'k", "Jigarrang"] },
  { q: "Turk tilida haftaning birinchi kuni (Dushanba) nima deb ataladi?", a: "Pazartesi", o: ["Pazartesi", "Salı", "Çarşamba", "Pazar"] },
  { q: "\"Pazar\" qaysi kun?", a: "Yakshanba", o: ["Shanba", "Yakshanba", "Juma", "Seshanba"] },
  { q: "\"Köpek\" qaysi hayvon?", a: "Kuchuk (It)", o: ["Mushuk", "Kuchuk (It)", "Ot", "Eshak"] },
  { q: "\"Kedi\" qaysi hayvon?", a: "Mushuk", o: ["Mushuk", "It", "Quyon", "Tovuq"] },
  { q: "Turk tilida \"Su\" nimani anglatadi?", a: "Suv", o: ["Suv", "Sut", "Choy", "Sharbat"] },
  { q: "\"Ekmek\" nimani anglatadi?", a: "Non", o: ["Tuz", "Go'sht", "Non", "Guruch"] },
  { q: "\"Sıcak\" va \"Soğuk\" so'zlari nimani anglatadi?", a: "Issiq va Sovuq", o: ["Issiq va Sovuq", "Katta va Kichik", "Yaxshi va Yomon", "Tez va Sekin"] },
  { q: "\"Büyük\" so'zining ma'nosi nima?", a: "Katta", o: ["Kichik", "Katta", "Uzun", "Keng"] },
  { q: "\"Küçük\" so'zining ma'nosi nima?", a: "Kichik", o: ["Katta", "Kichik", "Past", "Baland"] },
  { q: "Turk tilida \"Çocuk\" nimani anglatadi?", a: "Bola", o: ["Katta odam", "Bola", "Qariya", "O'qituvchi"] },
  { q: "\"Öğretmen\" so'zining ma'nosi nima?", a: "O'qituvchi", o: ["O'quvchi", "O'qituvchi", "Shifokor", "Muhandis"] },
  { q: "\"Öğrenci\" so'zining ma'nosi nima?", a: "O'quvchi", o: ["O'qituvchi", "O'quvchi", "Direktor", "Sinfdosh"] },
  { q: "Turk tilida \"Ev\" nimani anglatadi?", a: "Uy", o: ["Maktab", "Uy", "Bog'", "Do'kon"] },
  { q: "\"Araba\" so'zining ma'nosi nima?", a: "Mashina (Avtomobil)", o: ["Arava", "Mashina (Avtomobil)", "Velosiped", "Samolyot"] },
  { q: "Turk tilida \"Yemek\" nimani anglatadi?", a: "Ovqat (Yeyish)", o: ["Ichish", "Uxlash", "Ovqat (Yeyish)", "O'ynash"] }
];

const getNextQuestionIndex = (ref, poolLength) => {
  if (ref.current.length === 0) {
    const arr = Array.from({ length: poolLength }, (_, i) => i);
    // Shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    ref.current = arr;
  }
  return ref.current.pop();
};

const MathGameScreen = ({ settings, onQuit }) => {
  const { gameType, operations, difficulty, blueTeam, redTeam } = settings;

  const [ropePosition, setRopePosition] = useState(50); // 10 (blue wins) to 90 (red wins)
  
  const [blueQuestion, setBlueQuestion] = useState(null);
  const [redQuestion, setRedQuestion] = useState(null);

  const [blueInput, setBlueInput] = useState('0');
  const [redInput, setRedInput] = useState('0');

  const [blueScore, setBlueScore] = useState(0);
  const [redScore, setRedScore] = useState(0);

  const [gameState, setGameState] = useState('playing'); // 'playing', 'finished'
  const [winner, setWinner] = useState(null);
  
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds total game time

  const [blueFeedback, setBlueFeedback] = useState(null); // null, or { selected: string, isCorrect: boolean }
  const [redFeedback, setRedFeedback] = useState(null);   // null, or { selected: string, isCorrect: boolean }

  const [countdown, setCountdown] = useState(3); // 3, 2, 1, 'start', null
  const [gameStarted, setGameStarted] = useState(false);

  // Refs for tracking question history to prevent repeats
  const blueUnusedIndicesRef = React.useRef([]);
  const redUnusedIndicesRef = React.useRef([]);
  const blueLastMathQuestionsRef = React.useRef([]);
  const redLastMathQuestionsRef = React.useRef([]);

  // Generate question helper wrapped in useCallback to avoid react-hooks warning
  const generateQuestionForTeam = useCallback((team) => {
    if (gameType === 'english' || gameType === 'russian' || gameType === 'mother' || gameType === 'biology' || gameType === 'chemistry' || gameType === 'physics' || gameType === 'history' || gameType === 'geography' || gameType === 'informatics' || gameType === 'literature' || gameType === 'turkish') {
      const questionsPool = 
        gameType === 'russian' ? russianQuestions : 
        (gameType === 'mother' ? motherQuestions : 
        (gameType === 'biology' ? biologyQuestions : 
        (gameType === 'chemistry' ? chemistryQuestions : 
        (gameType === 'physics' ? physicsQuestions : 
        (gameType === 'history' ? historyQuestions : 
        (gameType === 'geography' ? geographyQuestions : 
        (gameType === 'informatics' ? informaticsQuestions : 
        (gameType === 'literature' ? literatureQuestions : 
        (gameType === 'turkish' ? turkishQuestions : englishQuestions)))))))));
      
      const qIndex = getNextQuestionIndex(team === 'blue' ? blueUnusedIndicesRef : redUnusedIndicesRef, questionsPool.length);
      const chosenQ = questionsPool[qIndex];

      // Map options to letters A, B, C, D
      const optionsWithLetters = chosenQ.o.map((opt, i) => ({
        letter: String.fromCharCode(65 + i), // A, B, C, D
        text: opt
      }));

      const questionObj = {
        text: chosenQ.q,
        answer: chosenQ.a,
        options: optionsWithLetters
      };

      if (team === 'blue') {
        setBlueQuestion(questionObj);
        setBlueInput('0');
      } else {
        setRedQuestion(questionObj);
        setRedInput('0');
      }
      return;
    }

    // Math generator
    const randomOp = operations[Math.floor(Math.random() * operations.length)];
    let num1 = 0, num2 = 0, opSymbol = '', correctAnswer = 0;
    let questionText = '';
    let attempts = 0;
    const historyRef = team === 'blue' ? blueLastMathQuestionsRef : redLastMathQuestionsRef;

    do {
      if (difficulty === 'easy') {
        if (randomOp === 'addition') {
          num1 = Math.floor(Math.random() * 9) + 1;
          num2 = Math.floor(Math.random() * 9) + 1;
          opSymbol = '+';
          correctAnswer = num1 + num2;
        } else if (randomOp === 'subtraction') {
          num1 = Math.floor(Math.random() * 10) + 5;
          num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
          opSymbol = '-';
          correctAnswer = num1 - num2;
        } else if (randomOp === 'multiplication') {
          num1 = Math.floor(Math.random() * 5) + 2;
          num2 = Math.floor(Math.random() * 5) + 2;
          opSymbol = '×';
          correctAnswer = num1 * num2;
        } else { // division
          num2 = Math.floor(Math.random() * 5) + 1;
          correctAnswer = Math.floor(Math.random() * 5) + 1;
          num1 = num2 * correctAnswer;
          opSymbol = '÷';
        }
      } else if (difficulty === 'medium') {
        if (randomOp === 'addition') {
          num1 = Math.floor(Math.random() * 30) + 10;
          num2 = Math.floor(Math.random() * 30) + 10;
          opSymbol = '+';
          correctAnswer = num1 + num2;
        } else if (randomOp === 'subtraction') {
          num1 = Math.floor(Math.random() * 50) + 20;
          num2 = Math.floor(Math.random() * 20) + 5;
          opSymbol = '-';
          correctAnswer = num1 - num2;
        } else if (randomOp === 'multiplication') {
          num1 = Math.floor(Math.random() * 9) + 2;
          num2 = Math.floor(Math.random() * 9) + 2;
          opSymbol = '×';
          correctAnswer = num1 * num2;
        } else { // division
          num2 = Math.floor(Math.random() * 8) + 2;
          correctAnswer = Math.floor(Math.random() * 8) + 2;
          num1 = num2 * correctAnswer;
          opSymbol = '÷';
        }
      } else { // hard
        if (randomOp === 'addition') {
          num1 = Math.floor(Math.random() * 90) + 20;
          num2 = Math.floor(Math.random() * 90) + 20;
          opSymbol = '+';
          correctAnswer = num1 + num2;
        } else if (randomOp === 'subtraction') {
          num1 = Math.floor(Math.random() * 100) + 50;
          num2 = Math.floor(Math.random() * 50) + 10;
          opSymbol = '-';
          correctAnswer = num1 - num2;
        } else if (randomOp === 'multiplication') {
          num1 = Math.floor(Math.random() * 12) + 4;
          num2 = Math.floor(Math.random() * 12) + 4;
          opSymbol = '×';
          correctAnswer = num1 * num2;
        } else { // division
          num2 = Math.floor(Math.random() * 10) + 3;
          correctAnswer = Math.floor(Math.random() * 12) + 3;
          num1 = num2 * correctAnswer;
          opSymbol = '÷';
        }
      }
      questionText = `${num1} ${opSymbol} ${num2} = ?`;
      attempts++;
    } while (historyRef.current.includes(questionText) && attempts < 30);

    historyRef.current.push(questionText);
    if (historyRef.current.length > 5) {
      historyRef.current.shift();
    }

    const questionObj = {
      text: questionText,
      answer: correctAnswer
    };

    if (team === 'blue') {
      setBlueQuestion(questionObj);
      setBlueInput('0');
    } else {
      setRedQuestion(questionObj);
      setRedInput('0');
    }
  }, [operations, difficulty, gameType]);

  // Background audio loop effect
  useEffect(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}uzbek_bg.mp3`);
    audio.loop = true;
    audio.volume = 0.3; // nice background level
    
    // Play audio with error catching for browser policies
    const playAudio = () => {
      audio.play().catch(err => {
        console.warn("Autoplay prevented by browser: ", err);
      });
    };

    playAudio();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Countdown phase timer effect
  useEffect(() => {
    if (countdown === null) return;
    const timer = setTimeout(() => {
      if (countdown === 3) {
        setCountdown(2);
      } else if (countdown === 2) {
        setCountdown(1);
      } else if (countdown === 1) {
        setCountdown('start');
      } else if (countdown === 'start') {
        setCountdown(null);
        setGameStarted(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Start game: generate first questions
  useEffect(() => {
    generateQuestionForTeam('blue');
    generateQuestionForTeam('red');
  }, [generateQuestionForTeam]);

  // Main countdown timer
  useEffect(() => {
    if (gameState !== 'playing' || !gameStarted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up: decide winner based on rope position
          setGameState('finished');
          if (ropePosition < 50) {
            setWinner('blue');
          } else if (ropePosition > 50) {
            setWinner('red');
          } else {
            setWinner('draw');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, ropePosition, gameStarted]);

  // Keypad Actions
  const handleDigitPress = (team, digit) => {
    if (team === 'blue') {
      setBlueInput(prev => (prev === '0' ? String(digit) : prev + digit));
    } else {
      setRedInput(prev => (prev === '0' ? String(digit) : prev + digit));
    }
  };

  const handleClear = (team) => {
    if (team === 'blue') {
      setBlueInput('0');
    } else {
      setRedInput('0');
    }
  };

  const handleSubmit = (team) => {
    if (team === 'blue') {
      if (blueFeedback) return;
      const isCorrect = parseInt(blueInput) === blueQuestion.answer;
      setBlueFeedback({ isCorrect });
      
      setTimeout(() => {
        if (isCorrect) {
          setBlueScore(prev => prev + 1);
          setRopePosition(prev => {
            const next = Math.max(10, prev - 8); // pull towards left (blue side)
            if (next <= 10) {
              setGameState('finished');
              setWinner('blue');
            }
            return next;
          });
          generateQuestionForTeam('blue');
        } else {
          setBlueInput('0');
          setRopePosition(prev => Math.min(90, prev + 2));
        }
        setBlueFeedback(null);
      }, 1200);
    } else {
      if (redFeedback) return;
      const isCorrect = parseInt(redInput) === redQuestion.answer;
      setRedFeedback({ isCorrect });
      
      setTimeout(() => {
        if (isCorrect) {
          setRedScore(prev => prev + 1);
          setRopePosition(prev => {
            const next = Math.min(90, prev + 8); // pull towards right (red side)
            if (next >= 90) {
              setGameState('finished');
              setWinner('red');
            }
            return next;
          });
          generateQuestionForTeam('red');
        } else {
          setRedInput('0');
          setRopePosition(prev => Math.max(10, prev - 2));
        }
        setRedFeedback(null);
      }, 1200);
    }
  };

  // English multiple choice handlers
  const handleChoiceSubmit = (team, choiceText) => {
    if (team === 'blue') {
      if (blueFeedback) return;
      const isCorrect = choiceText === blueQuestion.answer;
      setBlueFeedback({ selected: choiceText, isCorrect });
      
      setTimeout(() => {
        if (isCorrect) {
          setBlueScore(prev => prev + 1);
          setRopePosition(prev => {
            const next = Math.max(10, prev - 8); // pull left
            if (next <= 10) {
              setGameState('finished');
              setWinner('blue');
            }
            return next;
          });
        } else {
          // Incorrect pulls right
          setRopePosition(prev => {
            const next = Math.min(90, prev + 8); // pull right
            if (next >= 90) {
              setGameState('finished');
              setWinner('red');
            }
            return next;
          });
        }
        setBlueFeedback(null);
        generateQuestionForTeam('blue');
      }, 1200);
    } else {
      if (redFeedback) return;
      const isCorrect = choiceText === redQuestion.answer;
      setRedFeedback({ selected: choiceText, isCorrect });
      
      setTimeout(() => {
        if (isCorrect) {
          setRedScore(prev => prev + 1);
          setRopePosition(prev => {
            const next = Math.min(90, prev + 8); // pull right
            if (next >= 90) {
              setGameState('finished');
              setWinner('red');
            }
            return next;
          });
        } else {
          // Incorrect pulls left
          setRopePosition(prev => {
            const next = Math.max(10, prev - 8); // pull left
            if (next <= 10) {
              setGameState('finished');
              setWinner('blue');
            }
            return next;
          });
        }
        setRedFeedback(null);
        generateQuestionForTeam('red');
      }, 1200);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  const restartGame = () => {
    blueUnusedIndicesRef.current = [];
    redUnusedIndicesRef.current = [];
    blueLastMathQuestionsRef.current = [];
    redLastMathQuestionsRef.current = [];
    setRopePosition(50);
    setBlueScore(0);
    setRedScore(0);
    setTimeLeft(60);
    setGameState('playing');
    setWinner(null);
    setCountdown(3);
    setGameStarted(false);
    generateQuestionForTeam('blue');
    generateQuestionForTeam('red');
  };

  const ropeOffset = 20 + ((ropePosition - 10) / 80) * 360;

  return (
    <div className="math-game-root">
      {/* Game Screen Header */}
      <div className="game-screen-header">
        <div className="game-header-left">
          <button type="button" className="game-home-btn" onClick={onQuit}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            HOME
          </button>
        </div>

        <div className="game-header-center">
          <h1 className="game-main-title">
            ARQON TORTISH: {gameType === 'english' ? 'INGLIZ TILI' : (gameType === 'russian' ? 'RUS TILI' : (gameType === 'mother' ? 'ONA TILI' : (gameType === 'biology' ? 'BIOLOGIYA' : (gameType === 'chemistry' ? 'KIMYO' : (gameType === 'physics' ? 'FIZIKA' : (gameType === 'history' ? 'TARIX' : (gameType === 'geography' ? 'GEOGRAFIYA' : (gameType === 'informatics' ? 'INFORMATIKA' : (gameType === 'literature' ? 'ADABIYOT' : (gameType === 'turkish' ? 'TURK TILI' : 'MATEMATIKA'))))))))))}
          </h1>
          <p className="game-description" style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0', fontWeight: '600', textAlign: 'center', lineHeight: '1.4' }}>
            To'g'ri javob — arqon siz tomonga tortiladi. <br />
            Noto'g'ri javob — arqon raqib tomonga siljiydi va darhol yangi savol chiqadi.
          </p>
        </div>

        <div className="game-header-right">
          <div className="game-lang-dropdown">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              <rect width="18" height="4" fill="#0099B5" />
              <rect y="4" width="18" height="4" fill="#ffffff" />
              <rect y="3.75" width="18" height="0.25" fill="#D6182A" />
              <rect y="8" width="18" height="0.25" fill="#D6182A" />
              <rect y="8" width="18" height="4" fill="#1EB53A" />
            </svg>
            <span style={{ fontSize: '13px', fontWeight: '800' }}>UZ</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="game-lang-arrow">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      <div className="game-split-arena">
        {/* Left Column: Blue Team Panel */}
        <div className="team-math-panel blue">
          <div className="team-math-header">
            <span className="team-name-title">{blueTeam}</span>
            <div className="team-score-badge">{blueScore}</div>
          </div>
          
          <div 
            className={`team-question-box ${
              blueFeedback ? (blueFeedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect') : ''
            }`}
            style={(gameType === 'english' || gameType === 'russian' || gameType === 'mother' || gameType === 'biology' || gameType === 'chemistry' || gameType === 'physics' || gameType === 'history' || gameType === 'geography' || gameType === 'informatics' || gameType === 'literature' || gameType === 'turkish') ? { fontSize: '18px', padding: '16px' } : {}}
          >
            {countdown !== null ? 'Savol...' : (blueQuestion ? blueQuestion.text : '...')}
          </div>

          {(gameType === 'english' || gameType === 'russian' || gameType === 'mother' || gameType === 'biology' || gameType === 'chemistry' || gameType === 'physics' || gameType === 'history' || gameType === 'geography' || gameType === 'informatics' || gameType === 'literature' || gameType === 'turkish') ? (
            <div className="team-options-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {countdown !== null ? (
                ['A', 'B', 'C', 'D'].map((letter) => (
                  <button key={`blue-opt-placeholder-${letter}`} type="button" className="choice-card faded-choice" disabled>
                    <span className="choice-letter-box blue">{letter}</span>
                    <span className="choice-text-val">...</span>
                  </button>
                ))
              ) : (
                blueQuestion && blueQuestion.options.map(opt => {
                  let btnClass = "choice-card";
                  let ltrClass = "choice-letter-box blue";
                  if (blueFeedback) {
                    if (opt.text === blueFeedback.selected) {
                      if (blueFeedback.isCorrect) {
                        btnClass += " correct-choice";
                        ltrClass += " correct-choice";
                      } else {
                        btnClass += " incorrect-choice";
                        ltrClass += " incorrect-choice";
                      }
                    } else {
                      btnClass += " faded-choice";
                    }
                  }
                  return (
                    <button 
                      key={`blue-opt-${opt.letter}`}
                      type="button" 
                      className={btnClass}
                      onClick={() => handleChoiceSubmit('blue', opt.text)}
                      disabled={!!blueFeedback}
                    >
                      <span className={ltrClass}>{opt.letter}</span>
                      <span className="choice-text-val">{opt.text}</span>
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <>
              <div className="team-input-display">
                {countdown !== null ? '—' : blueInput}
              </div>

              <div className="team-keypad-grid" style={countdown !== null ? { opacity: 0.3, pointerEvents: 'none' } : {}}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button 
                    key={`blue-key-${num}`} 
                    type="button" 
                    className="keypad-btn"
                    onClick={() => handleDigitPress('blue', num)}
                    disabled={!!blueFeedback || countdown !== null}
                  >
                    {num}
                  </button>
                ))}
                <button 
                  type="button" 
                  className="keypad-btn clear"
                  onClick={() => handleClear('blue')}
                  disabled={!!blueFeedback || countdown !== null}
                >
                  ❌
                </button>
                <button 
                  type="button" 
                  className="keypad-btn"
                  onClick={() => handleDigitPress('blue', 0)}
                  disabled={!!blueFeedback || countdown !== null}
                >
                  0
                </button>
                <button 
                  type="button" 
                  className="keypad-btn submit"
                  onClick={() => handleSubmit('blue')}
                  disabled={!!blueFeedback || countdown !== null}
                >
                  ✔️
                </button>
              </div>
            </>
          )}
        </div>

        {/* Center Column: Tug of War Unified Card */}
        <div className="game-center-arena">
          <div className="arena-card">
            {/* Header with team scores and timer */}
            <div className="arena-card-header">
              <div className="arena-header-team blue">
                <span className="team-lbl">{blueTeam}</span>
                <span className="team-score-val">{blueScore}</span>
              </div>
              <div className="arena-header-timer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="timer-val">{countdown !== null ? '00:00' : formatTime(timeLeft)}</span>
              </div>
              <div className="arena-header-team red">
                <span className="team-lbl">{redTeam}</span>
                <span className="team-score-val">{redScore}</span>
              </div>
            </div>

            {/* Animation Area */}
            <div className="arena-card-body">
              {gameState === 'playing' ? (
                <svg width="100%" height="100%" viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
                  {/* Dotted center line */}
                  <line x1="200" y1="0" x2="200" y2="240" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 6" />

                  {/* Black rope */}
                  <line x1="20" y1="130" x2="380" y2="130" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />

                  {/* Red marker on the rope */}
                  <polygon 
                    points={`${ropeOffset},120 ${ropeOffset - 6},110 ${ropeOffset + 6},110`} 
                    fill="#ef4444" 
                  />
                  <line x1={ropeOffset} y1="110" x2={ropeOffset} y2="140" stroke="#ef4444" strokeWidth="3" />

                  {/* Left Team (Blue) characters: pulling rope */}
                  <g transform={`translate(${ropeOffset - 200}, 0)`}>
                    {/* Character 1 (front) */}
                    <g transform="translate(130, 80)">
                      <g className="char-animate-left char-delay-1">
                        {/* Back Leg (stretched) */}
                        <path d="M 5 62 L -15 88 L -5 90 L 10 65 Z" fill="#0f172a" />
                        <path d="M -15 88 L -23 92 L -18 94 L -11 90 Z" fill="#2563eb" /> {/* Shoe */}
                        <path d="M -23 92 L -21 94 L -18 94 Z" fill="#ffffff" /> {/* Sole */}

                        {/* Front Leg (bent) */}
                        <path d="M 22 62 Q 30 75, 20 88 L 28 90 Q 38 75, 28 62 Z" fill="#0f172a" />
                        <path d="M 20 88 L 16 93 L 24 95 L 28 90 Z" fill="#2563eb" /> {/* Shoe */}
                        <path d="M 16 93 L 18 95 L 24 95 Z" fill="#ffffff" /> {/* Sole */}

                        {/* Torso (leaning back) */}
                        <path d="M 5 30 L 25 30 L 22 65 L 5 62 Z" fill="#2563eb" />
                        
                        {/* Ikat/Adras Pattern details (wavy lines on shirt) */}
                        <path d="M 8 32 Q 13 45, 10 60" stroke="#facc15" strokeWidth="2.5" fill="none" />
                        <path d="M 13 32 Q 18 45, 15 60" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />
                        <path d="M 18 32 Q 23 45, 20 60" stroke="#60a5fa" strokeWidth="2.5" fill="none" />

                        {/* Neck */}
                        <rect x="11" y="24" width="6" height="8" fill="#fed7aa" transform="rotate(-10 14 28)" />

                        {/* Head (facing right) */}
                        <g transform="translate(4, 4)">
                          {/* Face Profile base */}
                          <path d="M10 20 C 10 12, 22 12, 22 20 C 22 23, 19 25, 14 25 C 10 25, 10 23, 10 20 Z" fill="#fed7aa" />
                          {/* Nose and Chin profile */}
                          <path d="M20 18 L 24 20 L 21 21 L 21 23 L 18 24 Z" fill="#fed7aa" />
                          {/* Ear */}
                          <circle cx="13" cy="20" r="2.5" fill="#fed7aa" stroke="#f43f5e" strokeWidth="0.5" />
                          {/* Eye */}
                          <circle cx="18" cy="18" r="1.2" fill="#0f172a" />
                          {/* Hair */}
                          <path d="M10 20 C 10 16, 12 14, 13 14 L 11 22 Z" fill="#0f172a" />
                          {/* Doppi */}
                          <path d="M10 14 C 10 7, 21 7, 21 14 Z" fill="#0f172a" />
                          {/* Traditional arches/crescents on Doppi */}
                          <path d="M12 12 Q 14 10, 16 12" stroke="#ffffff" strokeWidth="1" fill="none" />
                          <path d="M16 12 Q 18 10, 20 12" stroke="#ffffff" strokeWidth="1" fill="none" />
                          <circle cx="14" cy="9.5" r="0.6" fill="#ffffff" />
                          <circle cx="18" cy="9.5" r="0.6" fill="#ffffff" />
                        </g>

                        {/* Arms pulling rope */}
                        <path d="M 20 35 Q 40 45, 55 48" stroke="#2563eb" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <circle cx="55" cy="48" r="4" fill="#fed7aa" />
                      </g>
                    </g>

                    {/* Character 2 (back) */}
                    <g transform="translate(80, 80)">
                      <g className="char-animate-left char-delay-2">
                        {/* Back Leg (stretched) */}
                        <path d="M 5 62 L -15 88 L -5 90 L 10 65 Z" fill="#0f172a" />
                        <path d="M -15 88 L -23 92 L -18 94 L -11 90 Z" fill="#2563eb" /> {/* Shoe */}
                        <path d="M -23 92 L -21 94 L -18 94 Z" fill="#ffffff" /> {/* Sole */}

                        {/* Front Leg (bent) */}
                        <path d="M 22 62 Q 30 75, 20 88 L 28 90 Q 38 75, 28 62 Z" fill="#0f172a" />
                        <path d="M 20 88 L 16 93 L 24 95 L 28 90 Z" fill="#2563eb" /> {/* Shoe */}
                        <path d="M 16 93 L 18 95 L 24 95 Z" fill="#ffffff" /> {/* Sole */}

                        {/* Torso (leaning back) */}
                        <path d="M 5 30 L 25 30 L 22 65 L 5 62 Z" fill="#2563eb" />
                        
                        {/* Ikat/Adras Pattern details (wavy lines on shirt) */}
                        <path d="M 8 32 Q 13 45, 10 60" stroke="#facc15" strokeWidth="2.5" fill="none" />
                        <path d="M 13 32 Q 18 45, 15 60" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />
                        <path d="M 18 32 Q 23 45, 20 60" stroke="#60a5fa" strokeWidth="2.5" fill="none" />

                        {/* Neck */}
                        <rect x="11" y="24" width="6" height="8" fill="#fed7aa" transform="rotate(-10 14 28)" />

                        {/* Head (facing right) */}
                        <g transform="translate(4, 4)">
                          {/* Face Profile base */}
                          <path d="M10 20 C 10 12, 22 12, 22 20 C 22 23, 19 25, 14 25 C 10 25, 10 23, 10 20 Z" fill="#fed7aa" />
                          {/* Nose and Chin profile */}
                          <path d="M20 18 L 24 20 L 21 21 L 21 23 L 18 24 Z" fill="#fed7aa" />
                          {/* Ear */}
                          <circle cx="13" cy="20" r="2.5" fill="#fed7aa" stroke="#f43f5e" strokeWidth="0.5" />
                          {/* Eye */}
                          <circle cx="18" cy="18" r="1.2" fill="#0f172a" />
                          {/* Hair */}
                          <path d="M10 20 C 10 16, 12 14, 13 14 L 11 22 Z" fill="#0f172a" />
                          {/* Doppi */}
                          <path d="M10 14 C 10 7, 21 7, 21 14 Z" fill="#0f172a" />
                          {/* Traditional arches/crescents on Doppi */}
                          <path d="M12 12 Q 14 10, 16 12" stroke="#ffffff" strokeWidth="1" fill="none" />
                          <path d="M16 12 Q 18 10, 20 12" stroke="#ffffff" strokeWidth="1" fill="none" />
                          <circle cx="14" cy="9.5" r="0.6" fill="#ffffff" />
                          <circle cx="18" cy="9.5" r="0.6" fill="#ffffff" />
                        </g>

                        {/* Arms pulling rope */}
                        <path d="M 20 35 Q 40 45, 55 48" stroke="#2563eb" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <circle cx="55" cy="48" r="4" fill="#fed7aa" />
                      </g>
                    </g>
                  </g>

                  {/* Right Team (Red) characters: pulling rope */}
                  <g transform={`translate(${ropeOffset - 200}, 0)`}>
                    {/* Character 1 (front) */}
                    <g transform="translate(230, 80) scale(-1, 1) translate(-40, 0)">
                      <g className="char-animate-right char-delay-1">
                        {/* Back Leg (stretched) */}
                        <path d="M 5 62 L -15 88 L -5 90 L 10 65 Z" fill="#0f172a" />
                        <path d="M -15 88 L -23 92 L -18 94 L -11 90 Z" fill="#dc2626" /> {/* Shoe */}
                        <path d="M -23 92 L -21 94 L -18 94 Z" fill="#ffffff" /> {/* Sole */}

                        {/* Front Leg (bent) */}
                        <path d="M 22 62 Q 30 75, 20 88 L 28 90 Q 38 75, 28 62 Z" fill="#0f172a" />
                        <path d="M 20 88 L 16 93 L 24 95 L 28 90 Z" fill="#dc2626" /> {/* Shoe */}
                        <path d="M 16 93 L 18 95 L 24 95 Z" fill="#ffffff" /> {/* Sole */}

                        {/* Torso (leaning back) */}
                        <path d="M 5 30 L 25 30 L 22 65 L 5 62 Z" fill="#dc2626" />
                        
                        {/* Ikat/Adras Pattern details (wavy lines on shirt) */}
                        <path d="M 8 32 Q 13 45, 10 60" stroke="#facc15" strokeWidth="2.5" fill="none" />
                        <path d="M 13 32 Q 18 45, 15 60" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />
                        <path d="M 18 32 Q 23 45, 20 60" stroke="#22c55e" strokeWidth="2.5" fill="none" />

                        {/* Neck */}
                        <rect x="11" y="24" width="6" height="8" fill="#fed7aa" transform="rotate(-10 14 28)" />

                        {/* Head (facing right in its local space, mirrored to left) */}
                        <g transform="translate(4, 4)">
                          {/* Face Profile base */}
                          <path d="M10 20 C 10 12, 22 12, 22 20 C 22 23, 19 25, 14 25 C 10 25, 10 23, 10 20 Z" fill="#fed7aa" />
                          {/* Nose and Chin profile */}
                          <path d="M20 18 L 24 20 L 21 21 L 21 23 L 18 24 Z" fill="#fed7aa" />
                          {/* Ear */}
                          <circle cx="13" cy="20" r="2.5" fill="#fed7aa" stroke="#f43f5e" strokeWidth="0.5" />
                          {/* Eye */}
                          <circle cx="18" cy="18" r="1.2" fill="#0f172a" />
                          {/* Hair */}
                          <path d="M10 20 C 10 16, 12 14, 13 14 L 11 22 Z" fill="#0f172a" />
                          {/* Doppi */}
                          <path d="M10 14 C 10 7, 21 7, 21 14 Z" fill="#0f172a" />
                          {/* Traditional arches/crescents on Doppi */}
                          <path d="M12 12 Q 14 10, 16 12" stroke="#ffffff" strokeWidth="1" fill="none" />
                          <path d="M16 12 Q 18 10, 20 12" stroke="#ffffff" strokeWidth="1" fill="none" />
                          <circle cx="14" cy="9.5" r="0.6" fill="#ffffff" />
                          <circle cx="18" cy="9.5" r="0.6" fill="#ffffff" />
                        </g>

                        {/* Arms pulling rope */}
                        <path d="M 20 35 Q 40 45, 55 48" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <circle cx="55" cy="48" r="4" fill="#fed7aa" />
                      </g>
                    </g>

                    {/* Character 2 (back) */}
                    <g transform="translate(280, 80) scale(-1, 1) translate(-40, 0)">
                      <g className="char-animate-right char-delay-2">
                        {/* Back Leg (stretched) */}
                        <path d="M 5 62 L -15 88 L -5 90 L 10 65 Z" fill="#0f172a" />
                        <path d="M -15 88 L -23 92 L -18 94 L -11 90 Z" fill="#dc2626" /> {/* Shoe */}
                        <path d="M -23 92 L -21 94 L -18 94 Z" fill="#ffffff" /> {/* Sole */}

                        {/* Front Leg (bent) */}
                        <path d="M 22 62 Q 30 75, 20 88 L 28 90 Q 38 75, 28 62 Z" fill="#0f172a" />
                        <path d="M 20 88 L 16 93 L 24 95 L 28 90 Z" fill="#dc2626" /> {/* Shoe */}
                        <path d="M 16 93 L 18 95 L 24 95 Z" fill="#ffffff" /> {/* Sole */}

                        {/* Torso (leaning back) */}
                        <path d="M 5 30 L 25 30 L 22 65 L 5 62 Z" fill="#dc2626" />
                        
                        {/* Ikat/Adras Pattern details (wavy lines on shirt) */}
                        <path d="M 8 32 Q 13 45, 10 60" stroke="#facc15" strokeWidth="2.5" fill="none" />
                        <path d="M 13 32 Q 18 45, 15 60" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />
                        <path d="M 18 32 Q 23 45, 20 60" stroke="#22c55e" strokeWidth="2.5" fill="none" />

                        {/* Neck */}
                        <rect x="11" y="24" width="6" height="8" fill="#fed7aa" transform="rotate(-10 14 28)" />

                        {/* Head (facing right in its local space, mirrored to left) */}
                        <g transform="translate(4, 4)">
                          {/* Face Profile base */}
                          <path d="M10 20 C 10 12, 22 12, 22 20 C 22 23, 19 25, 14 25 C 10 25, 10 23, 10 20 Z" fill="#fed7aa" />
                          {/* Nose and Chin profile */}
                          <path d="M20 18 L 24 20 L 21 21 L 21 23 L 18 24 Z" fill="#fed7aa" />
                          {/* Ear */}
                          <circle cx="13" cy="20" r="2.5" fill="#fed7aa" stroke="#f43f5e" strokeWidth="0.5" />
                          {/* Eye */}
                          <circle cx="18" cy="18" r="1.2" fill="#0f172a" />
                          {/* Hair */}
                          <path d="M10 20 C 10 16, 12 14, 13 14 L 11 22 Z" fill="#0f172a" />
                          {/* Doppi */}
                          <path d="M10 14 C 10 7, 21 7, 21 14 Z" fill="#0f172a" />
                          {/* Traditional arches/crescents on Doppi */}
                          <path d="M12 12 Q 14 10, 16 12" stroke="#ffffff" strokeWidth="1" fill="none" />
                          <path d="M16 12 Q 18 10, 20 12" stroke="#ffffff" strokeWidth="1" fill="none" />
                          <circle cx="14" cy="9.5" r="0.6" fill="#ffffff" />
                          <circle cx="18" cy="9.5" r="0.6" fill="#ffffff" />
                        </g>

                        {/* Arms pulling rope */}
                        <path d="M 20 35 Q 40 45, 55 48" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <circle cx="55" cy="48" r="4" fill="#fed7aa" />
                      </g>
                    </g>
                  </g>
                </svg>
            ) : (
              /* Inside Arena Winner Display */
              <div className="arena-victory-splash">
                <div className="victory-crown">👑</div>
                <h3 className="victory-text">G'ALABA!</h3>
                <span className={`victory-winner-name ${winner}`}>
                  {winner === 'draw' ? "DURANG!" : (winner === 'blue' ? blueTeam : redTeam)}
                </span>
                <p className="victory-desc">
                  {winner === 'draw' ? "O'yin durang natija bilan tugadi." : "Ushbu jamoa raqib arqonini to'liq tortib oldi!"}
                </p>
                
                <div className="victory-actions">
                  <button type="button" className="setup-btn next" onClick={restartGame}>♻️ Qayta o'ynash</button>
                  <button type="button" className="setup-btn back" onClick={onQuit}>🚪 Chiqish</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Red Team Panel */}
      <div className="team-math-panel red">
        <div className="team-math-header">
          <span className="team-name-title">{redTeam}</span>
          <div className="team-score-badge">{redScore}</div>
        </div>
        
        <div 
          className={`team-question-box ${
            redFeedback ? (redFeedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect') : ''
          }`}
          style={(gameType === 'english' || gameType === 'russian' || gameType === 'mother' || gameType === 'biology' || gameType === 'chemistry' || gameType === 'physics' || gameType === 'history' || gameType === 'geography' || gameType === 'informatics' || gameType === 'literature' || gameType === 'turkish') ? { fontSize: '18px', padding: '16px' } : {}}
        >
          {countdown !== null ? 'Savol...' : (redQuestion ? redQuestion.text : '...')}
        </div>

        {(gameType === 'english' || gameType === 'russian' || gameType === 'mother' || gameType === 'biology' || gameType === 'chemistry' || gameType === 'physics' || gameType === 'history' || gameType === 'geography' || gameType === 'informatics' || gameType === 'literature' || gameType === 'turkish') ? (
          <div className="team-options-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {countdown !== null ? (
              ['A', 'B', 'C', 'D'].map((letter) => (
                <button key={`red-opt-placeholder-${letter}`} type="button" className="choice-card faded-choice" disabled>
                  <span className="choice-letter-box red">{letter}</span>
                  <span className="choice-text-val">...</span>
                </button>
              ))
            ) : (
              redQuestion && redQuestion.options.map(opt => {
                let btnClass = "choice-card";
                let ltrClass = "choice-letter-box red";
                if (redFeedback) {
                  if (opt.text === redFeedback.selected) {
                    if (redFeedback.isCorrect) {
                      btnClass += " correct-choice";
                      ltrClass += " correct-choice";
                    } else {
                      btnClass += " incorrect-choice";
                      ltrClass += " incorrect-choice";
                    }
                  } else {
                    btnClass += " faded-choice";
                  }
                }
                return (
                  <button 
                    key={`red-opt-${opt.letter}`}
                    type="button" 
                    className={btnClass}
                    onClick={() => handleChoiceSubmit('red', opt.text)}
                    disabled={!!redFeedback}
                  >
                    <span className={ltrClass}>{opt.letter}</span>
                    <span className="choice-text-val">{opt.text}</span>
                  </button>
                );
              })
            )}
          </div>
        ) : (
          <>
            <div className="team-input-display">
              {countdown !== null ? '—' : redInput}
            </div>

            <div className="team-keypad-grid" style={countdown !== null ? { opacity: 0.3, pointerEvents: 'none' } : {}}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button 
                  key={`red-key-${num}`} 
                  type="button" 
                  className="keypad-btn"
                  onClick={() => handleDigitPress('red', num)}
                  disabled={!!redFeedback || countdown !== null}
                >
                  {num}
                </button>
              ))}
              <button 
                type="button" 
                className="keypad-btn clear"
                onClick={() => handleClear('red')}
                disabled={!!redFeedback || countdown !== null}
              >
                ❌
              </button>
              <button 
                type="button" 
                className="keypad-btn"
                onClick={() => handleDigitPress('red', 0)}
                disabled={!!redFeedback || countdown !== null}
              >
                0
              </button>
              <button 
                type="button" 
                className="keypad-btn submit"
                onClick={() => handleSubmit('red')}
                disabled={!!redFeedback || countdown !== null}
              >
                ✔️
              </button>
            </div>
          </>
        )}
      </div>
    </div>

    {/* Centered Telegram and Instagram floating social icons */}
    <div className="game-screen-footer">
      <a href="https://t.me/edugameschat" target="_blank" rel="noopener noreferrer" className="game-social-btn telegram" aria-label="Telegram">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.65-.52.36-.97.53-1.33.52-.4-.01-1.17-.23-1.74-.41-.7-.23-1.26-.35-1.21-.74.03-.2.3-.41.82-.62 3.2-1.39 5.34-2.31 6.41-2.75 3.05-1.27 3.68-1.49 4.1-.15a.73.73 0 0 1 .12.39c0 .17-.02.35-.06.51z"/>
        </svg>
      </a>
      <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="game-social-btn instagram" aria-label="Instagram">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </a>
    </div>

    {countdown !== null && (
      <div className={`arena-countdown-overlay ${countdown === 'start' ? 'countdown-start' : 'countdown-number'}`}>
        {countdown === 'start' ? 'BOSHLANDI!' : countdown}
      </div>
    )}
  </div>
  );
};

export default MathGameScreen;
