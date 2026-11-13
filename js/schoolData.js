export const SCHOOL_ROOMS = [
  {
    id: 'mtk',
    label: 'Matematika',
    teacher: 'Pak Ahmad',
    gender: 'putra',
    color: '#3f7fd9',
    skin: '#d69f70',
    lesson: 'Perkalian adalah penjumlahan berulang. Contoh: 4 x 3 artinya 4 + 4 + 4 = 12. Pembagian adalah kebalikan dari perkalian.',
    quiz: [
      { q: 'Hasil dari 6 x 7 adalah...', o: ['40', '42', '48'], a: 1 },
      { q: 'Hasil dari 12 : 4 adalah...', o: ['3', '4', '8'], a: 0 },
      { q: 'Hasil dari 7 x 8 adalah...', o: ['54', '56', '64'], a: 1 }
    ]
  },
  {
    id: 'ipa',
    label: 'IPA',
    teacher: 'Ibu Sari',
    gender: 'putri',
    color: '#2e9e5b',
    skin: '#b97f52',
    hijab: '#2f8f83',
    lesson: 'Tumbuhan membuat makanannya sendiri lewat fotosintesis dengan bantuan cahaya matahari, air, dan udara. Zat hijau daun bernama klorofil menangkap cahaya.',
    quiz: [
      { q: 'Tumbuhan membuat makanan dengan bantuan...', o: ['Cahaya matahari', 'Angin malam', 'Batu kerikil'], a: 0 },
      { q: 'Zat hijau pada daun yang menangkap cahaya disebut...', o: ['Klorofil', 'Kalsium', 'Keratin'], a: 0 },
      { q: 'Hasil sampingan fotosintesis yang kita hirup adalah...', o: ['Oksigen', 'Asap', 'Debu'], a: 0 }
    ]
  },
  {
    id: 'bindo',
    label: 'B. Indonesia',
    teacher: 'Ibu Dewi',
    gender: 'putri',
    color: '#d9822b',
    skin: '#eab890',
    hijab: '#7a2e3a',
    lesson: 'Kalimat efektif adalah kalimat yang singkat, jelas, dan mudah dipahami. Subjek kalimat diletakkan di awal.',
    quiz: [
      { q: 'Kalimat efektif yang benar adalah...', o: ['Kami pergi ke Surakarta.', 'Pergi kami ke Surakarta.', 'Ke Surakarta kami pergi.'], a: 0 },
      { q: 'Lawan kata dari "rajin" adalah...', o: ['Malas', 'Tekun', 'Pintar'], a: 0 },
      { q: 'Subjek pada kalimat "Budi makan nasi" adalah...', o: ['Budi', 'makan', 'nasi'], a: 0 }
    ]
  },
  {
    id: 'bing',
    label: 'B. Inggris',
    teacher: 'Pak Rizal',
    gender: 'putra',
    color: '#8b5cf6',
    skin: '#9c6444',
    lesson: '"Good morning" berarti selamat pagi. "Thank you" berarti terima kasih. Gunakan sapaan sopan saat menyapa guru.',
    quiz: [
      { q: '"Good morning" artinya...', o: ['Selamat malam', 'Selamat pagi', 'Sampai jumpa'], a: 1 },
      { q: '"Thank you" artinya...', o: ['Terima kasih', 'Maaf', 'Tolong'], a: 0 },
      { q: '"Good bye" artinya...', o: ['Selamat tinggal', 'Selamat pagi', 'Sampai jumpa di sini'], a: 0 }
    ]
  },
  {
    id: 'pai',
    label: 'PAI',
    teacher: 'Ustadz Hasan',
    gender: 'putra',
    color: '#0e9f9f',
    skin: '#eab890',
    peci: true,
    lesson: 'Kita wajib shalat lima waktu setiap hari, dan memulai aktivitas baik dengan mengucap bismillah.',
    quiz: [
      { q: 'Umat Islam wajib shalat ... waktu dalam sehari.', o: ['Tiga', 'Lima', 'Tujuh'], a: 1 },
      { q: 'Sebelum memulai kegiatan baik kita mengucap...', o: ['Bismillah', 'Astaghfirullah', 'Wassalamualaikum'], a: 0 },
      { q: 'Sebelum makan kita membaca...', o: ['Bismillah', 'Alhamdulillah', 'Subhanallah'], a: 0 }
    ]
  }
];
