import { DimensionInfo, LikertOption, RiasecDimension, RiasecQuestion } from '../types/riasec';

export const RIASEC_DIMENSIONS: Record<RiasecDimension, DimensionInfo> = {
  R: {
    code: 'R',
    nameId: 'Realistis',
    nameEn: 'Realistic',
    archetypeId: 'Praktikal & Pembuat (The Doers)',
    archetypeEn: 'The Doers',
    color: '#f43f5e',
    accentGradient: 'from-rose-500 to-red-600',
    description: 'Menyukai aktivitas praktis, mekanik, fisik, perakitan alat, kontak langsung dengan alam atau material nyata dibandingkan teori abstrak.',
    coreTraits: ['Praktis', 'Logis', 'Mekanikal', 'Tangguh', 'Suka Kerja Nyata', 'Sistematik Lapangan'],
    workEnvironment: 'Bengkel, laboratorium teknik, luar ruangan (outdoor), proyek konstruksi, atau industri agrikultur dan manufaktur.',
    sampleCareers: ['Teknisi Otomasi / Robotika', 'Insinyur Mesin & Elektro', 'Pilot & Teknisi Penerbangan', 'Arsitek Lansekap & Pertanian', 'Spesialis Jaringan Hardware', 'Dokter Bedah / Ahli Fisioterapi'],
    recommendedMajors: ['Teknik Mesin / Elektro / Sipil', 'Teknologi Hasil Pertanian', 'Mekatronika & Robotika', 'Sistem Komputer & Perangkat Keras', 'Pendidikan Jasmani & Kesehatan']
  },
  I: {
    code: 'I',
    nameId: 'Investigatif',
    nameEn: 'Investigative',
    archetypeId: 'Pemikir & Peneliti (The Thinkers)',
    archetypeEn: 'The Thinkers',
    color: '#06b6d4',
    accentGradient: 'from-cyan-500 to-blue-600',
    description: 'Menyukai observasi ilmiah, membedah masalah yang rumit, riset data, eksplorasi teori, logika matematis, dan memahami bagaimana segala hal bekerja.',
    coreTraits: ['Kritis', 'Analitis', 'Ingin Tahu Tinggi', 'Rasional', 'Mandiri', 'Berorientasi Riset'],
    workEnvironment: 'Laboratorium riset, pusat analisis data, universitas riset, divisi R&D perusahaan, atau ruang analisis strategi.',
    sampleCareers: ['Data Scientist / Analis Data', 'Ilmuwan Riset & Peneliti', 'Software Engineer & Algoritma', 'Dokter / Ahli Farmakologi', 'Analis Intelijen Keamanan Siber', 'Ekonom & Statistikawan'],
    recommendedMajors: ['Ilmu Komputer / Informatika', 'Matematika & Statistika', 'Fisika / Biologi / Kimia', 'Kedokteran & Biomedis', 'Ekonomi Pembangunan']
  },
  A: {
    code: 'A',
    nameId: 'Artistik',
    nameEn: 'Artistic',
    archetypeId: 'Pencipta & Inovator (The Creators)',
    archetypeEn: 'The Creators',
    color: '#ec4899',
    accentGradient: 'from-pink-500 to-rose-500',
    description: 'Menyukai kebebasan ekspresi diri, orisinalitas, estetika visual/audio, ide-ide inovatif, serta tidak menyukai aturan kaku dan rutinitas berulang.',
    coreTraits: ['Kreatif', 'Intuitif', 'Ekspresif', 'Imajinatif', 'Orisinal', 'Adaptif & Non-konvensional'],
    workEnvironment: 'Studio kreatif, agensi periklanan, panggung seni, ruang desain produk, media hiburan, atau bekerja fleksibel mandiri.',
    sampleCareers: ['UI/UX & Product Designer', 'Sutradara & Video Creator', 'Creative Director & Copywriter', 'Desainer Interior & Arsitek', 'Musisi & Audio Producer', 'Penulis Cerita & Game Designer'],
    recommendedMajors: ['Desain Komunikasi Visual (DKV)', 'Desain Produk / Interior', 'Seni Rupa & Media Baru', 'Sastra & Penulisan Kreatif', 'Animasi & Sinematografi']
  },
  S: {
    code: 'S',
    nameId: 'Sosial',
    nameEn: 'Social',
    archetypeId: 'Penolong & Pembimbing (The Helpers)',
    archetypeEn: 'The Helpers',
    color: '#10b981',
    accentGradient: 'from-emerald-500 to-teal-600',
    description: 'Menyukai interaksi manusia yang bermakna, membantu orang lain bertumbuh, mengajar, menyembuhkan, empati tinggi, dan kolaborasi positif.',
    coreTraits: ['Empatik', 'Komunikatif', 'Peduli', 'Kolaboratif', 'Penyabar', 'Inspiratif'],
    workEnvironment: 'Institusi pendidikan, rumah sakit, lembaga konseling, LSM sosial, komunitas pengembangan masyarakat, atau divisi HRD.',
    sampleCareers: ['Psikolog & Konselor Karir', 'Pendidik / Dosen / Guru', 'Spesialis People & HR Talent', 'Perawat & Terapi Wicara', 'Pekerja Sosial & Pemberdayaan Komunitas', 'Customer Success Leader'],
    recommendedMajors: ['Psikologi', 'Pendidikan & Keguruan', 'Manajemen Sumber Daya Manusia', 'Ilmu Keperawatan & Kesehatan Masyarakat', 'Ilmu Komunikasi']
  },
  E: {
    code: 'E',
    nameId: 'Wirausaha / Enterprising',
    nameEn: 'Enterprising',
    archetypeId: 'Penggerak & Pemimpin (The Persuaders)',
    archetypeEn: 'The Persuaders',
    color: '#f59e0b',
    accentGradient: 'from-amber-500 to-orange-600',
    description: 'Menyukai memimpin, mempengaruhi orang lain, negosiasi, mengambil inisiatif bisnis, berani mengambil risiko demi peluang besar, dan orientasi prestasi.',
    coreTraits: ['Persuasif', 'Karismatik', 'Ambisius', 'Percaya Diri', 'Visioner', 'Berani Mengambil Keputusan'],
    workEnvironment: 'Pusat eksekutif bisnis, tim ekspansi pasar, startup, firma negosiasi, lantai bursa, atau panggung kewirausahaan mandiri.',
    sampleCareers: ['Wirausahawan / Founder Bisnis', 'Marketing & Sales Director', 'Product Manager / Bisnis Developer', 'Pengacara Korporasi & Negosiator', 'Manajer Operasional Proyek', 'Konsultan Manajemen Strategis'],
    recommendedMajors: ['Manajemen Bisnis & Kewirausahaan', 'Pemasaran Internasional', 'Ilmu Hukum Bisnis', 'Hubungan Internasional', 'Administrasi Bisnis']
  },
  C: {
    code: 'C',
    nameId: 'Konvensional',
    nameEn: 'Conventional',
    archetypeId: 'Pengatur & Pengelola (The Organizers)',
    archetypeEn: 'The Organizers',
    color: '#8b5cf6',
    accentGradient: 'from-purple-500 to-indigo-600',
    description: 'Menyukai keteraturan sistematis, ketelitian terhadap data dan angka, kepatuhan prosedur baku, efisiensi operasional, dan kerapian arsip.',
    coreTraits: ['Teliti', 'Teratur', 'Metodis', 'Efisiensi Tinggi', 'Dapat Diandalkan', 'Patuh Standar'],
    workEnvironment: 'Lembaga keuangan perbankan, divisi akuntansi & audit, administrasi korporasi, kantor hukum kepatuhan, atau kantor pemerintahan.',
    sampleCareers: ['Akuntan Publik & Auditor', 'Analis Risiko Keuangan (Actuary)', 'Spesialis Manajemen Basis Data', 'Administrator Kepatuhan Regulasi', 'Spesialis Logistik & Rantai Pasok', 'Sekretaris Eksekutif'],
    recommendedMajors: ['Akuntansi & Perpajakan', 'Aktuaria & Matematika Terapan', 'Sistem Informasi Manajemen', 'Administrasi Perkantoran & Logistik', 'Perbankan Syariah / Keuangan']
  }
};

export const LIKERT_OPTIONS: LikertOption[] = [
  {
    value: 3,
    label: 'Sangat Setuju',
    enLabel: 'Strongly Agree',
    scoreText: '+3 Poin',
    colorClass: 'border-emerald-500/40 hover:border-emerald-400 bg-emerald-500/10 text-emerald-200'
  },
  {
    value: 2,
    label: 'Setuju',
    enLabel: 'Agree',
    scoreText: '+2 Poin',
    colorClass: 'border-cyan-500/40 hover:border-cyan-400 bg-cyan-500/10 text-cyan-200'
  },
  {
    value: 1,
    label: 'Netral / Ragu',
    enLabel: 'Neutral',
    scoreText: '+1 Poin',
    colorClass: 'border-amber-500/40 hover:border-amber-400 bg-amber-500/10 text-amber-200'
  },
  {
    value: 0,
    label: 'Tidak Setuju',
    enLabel: 'Disagree',
    scoreText: '0 Poin',
    colorClass: 'border-slate-500/40 hover:border-slate-400 bg-slate-500/10 text-slate-300'
  }
];

export const RIASEC_QUESTIONS: RiasecQuestion[] = [
  // Realistic (2 Questions)
  {
    id: 1,
    dimension: 'R',
    dimensionTitle: 'Realistis (Realistic)',
    statement: 'Saya senang merakit, mengoperasikan, memperbaiki alat mekanik/elektronik, atau membuat benda fisik dengan tangan sendiri.',
    subtext: 'Menikmati pekerjaan teknis langsung yang membuahkan hasil konkrit yang dapat disentuh dan berfungsi nyata.'
  },
  {
    id: 2,
    dimension: 'R',
    dimensionTitle: 'Realistis (Realistic)',
    statement: 'Saya lebih menikmati aktivitas di lapangan/luar ruangan (outdoor) dan kegiatan fisik dibandingkan harus duduk seharian menelaah konsep abstrak di balik meja.',
    subtext: 'Menyukai dinamika lapangan, interaksi dengan mesin, tanaman, hewan, atau material fisik.'
  },

  // Investigative (2 Questions)
  {
    id: 3,
    dimension: 'I',
    dimensionTitle: 'Investigatif (Investigative)',
    statement: 'Saya tertarik membedah penyebab suatu masalah yang rumit, mengumpulkan data ilmiah, dan melakukan analisis logis hingga menemukan solusi dasarnya.',
    subtext: 'Memiliki dorongan rasa ingin tahu tinggi untuk menguak alasan di balik suatu fenomena.'
  },
  {
    id: 4,
    dimension: 'I',
    dimensionTitle: 'Investigatif (Investigative)',
    statement: 'Mempelajari topik teknologi baru, eksperimen sains, teka-teki logika, atau formula matematika memberikan kepuasan intelektual tersendiri bagi saya.',
    subtext: 'Lebih memilih berpikir mendalam dan independen dalam memecahkan misteri intelektual.'
  },

  // Artistic (2 Questions)
  {
    id: 5,
    dimension: 'A',
    dimensionTitle: 'Artistik (Artistic)',
    statement: 'Saya senang mengekspresikan ide dan emosi melalui desain visual, tulisan kreatif, musik, pembuatan konten digital, atau karya seni orisinal.',
    subtext: 'Memiliki kepekaan estetika dan kecintaan terhadap kreasi yang unik tanpa meniru orang lain.'
  },
  {
    id: 6,
    dimension: 'A',
    dimensionTitle: 'Artistik (Artistic)',
    statement: 'Saya bekerja paling produktif ketika diberi ruang kebebasan bereksplorasi tanpa harus terikat prosedur birokrasi atau jadwal baku yang terlalu kaku.',
    subtext: 'Menyukai fleksibilitas, intuisi spontan, dan lingkungan kerja yang merangsang imajinasi.'
  },

  // Social (2 Questions)
  {
    id: 7,
    dimension: 'S',
    dimensionTitle: 'Sosial (Social)',
    statement: 'Saya merasa sangat puas dan bermakna ketika bisa membimbing, mengajar, mendengarkan, atau membantu orang lain memecahkan masalah kehidupannya.',
    subtext: 'Memiliki empati mendalam dan kepedulian tulus terhadap kesejahteraan sesama.'
  },
  {
    id: 8,
    dimension: 'S',
    dimensionTitle: 'Sosial (Social)',
    statement: 'Bekerja sama dalam kelompok dan menjalin hubungan komunikasi antarpersonal yang akrab merupakan kelebihan utama saya.',
    subtext: 'Mengutamakan keharmonisan, kerja tim, dan kemampuan memotivasi orang di sekitar.'
  },

  // Enterprising (2 Questions)
  {
    id: 9,
    dimension: 'E',
    dimensionTitle: 'Wirausaha (Enterprising)',
    statement: 'Saya percaya diri dalam memimpin tim, meyakinkan/mempengaruhi orang lain, serta mempresentasikan ide atau produk baru di depan umum.',
    subtext: 'Memiliki daya persuasi kuat, karisma, dan antusiasme untuk menggerakkan orang mencapai target.'
  },
  {
    id: 10,
    dimension: 'E',
    dimensionTitle: 'Wirausaha (Enterprising)',
    statement: 'Mengambil inisiatif bisnis baru, bernegosiasi untuk mencapai kesepakatan menguntungkan, dan mengejar target berisiko tinggi memicu adrenalin positif saya.',
    subtext: 'Fokus pada pencapaian hasil, ekspansi peluang pasar, dan jiwa kepemimpinan dinamis.'
  },

  // Conventional (2 Questions)
  {
    id: 11,
    dimension: 'C',
    dimensionTitle: 'Konvensional (Conventional)',
    statement: 'Saya menyukai pekerjaan yang membutuhkan ketelitian tinggi, pengelolaan data atau angka yang teratur, serta mengikuti prosedur panduan kerja yang jelas.',
    subtext: 'Menghargai akurasi data, minim kesalahan, dan kerapian sistematis dalam setiap proses.'
  },
  {
    id: 12,
    dimension: 'C',
    dimensionTitle: 'Konvensional (Conventional)',
    statement: 'Mengatur arsip dokumen, menyusun pembukuan/anggaran, atau merancang alur kerja yang terstruktur membuat saya merasa tenang dan terkendali.',
    subtext: 'Nyaman dalam keteraturan, prediktabilitas, dan lingkungan yang tertib administratif.'
  }
];

export const HOLLAND_HEXAGON_ORDER: RiasecDimension[] = ['R', 'I', 'A', 'S', 'E', 'C'];
