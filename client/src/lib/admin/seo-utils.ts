// client/src/lib/admin/seo-utils.ts

import { normalizeFilterName } from './product-utils';

export const countSeoTags = (value?: string | null) => {
  return (value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20)
    .length;
};

export const normalizeSeoTags = (value?: string | null) => {
  return (value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20)
    .join('\n');
};

export const uniqueSeoLines = (items: Array<string | null | undefined>) => {
  const seen = new Set<string>();

  return items
    .map((item) => (item || '').trim())
    .filter(Boolean)
    .filter((item) => {
      const key = normalizeFilterName(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

export const getSeoSourceText = (source: {
  name?: string | null;
  brand?: string | null;
  category?: string | null;
  operational_type?: string | null;
  subcategory?: string | null;
  specs?: string | null;
  technical_specs?: string | null;
}, selectedFilters: string[]) => {
  return [
    source.name,
    source.brand,
    source.category,
    source.operational_type,
    source.subcategory,
    source.specs,
    source.technical_specs,
    ...selectedFilters,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const buildSemanticSeoTagsFromText = (sourceText: string, categoryName?: string | null) => {
  const normalizedText = normalizeFilterName(sourceText);
  const normalizedCategory = normalizeFilterName(categoryName);
  const suggestions: string[] = [];

  const hasAny = (terms: string[]) =>
    terms.some((term) => normalizedText.includes(normalizeFilterName(term)));

  const addIf = (condition: boolean, tags: string[]) => {
    if (condition) suggestions.push(...tags);
  };

  addIf(hasAny(['netflix approved', 'netflix']), [
    'produção Netflix',
    'séries e streaming',
    'produção audiovisual premium',
  ]);

  addIf(hasAny(['cinealta']), [
    'workflow CineAlta',
    'cinema digital premium',
  ]);

  addIf(hasAny(['full frame', 'full-frame', 'sensor full frame']), [
    'captação full frame',
    'câmera full frame para cinema',
    'workflow cinema digital',
  ]);

  addIf(hasAny(['super35', 'super 35', 'super-35', 's35']), [
    'captação Super 35',
    'câmera Super 35 para cinema',
  ]);

  addIf(hasAny(['8k']), [
    'produção cinematográfica 8K',
    'captura em alta resolução',
  ]);

  addIf(hasAny(['6k']), [
    'produção cinematográfica 6K',
    'captura alta resolução cinema',
  ]);

  addIf(hasAny(['4k', 'uhd']), [
    'produção 4K profissional',
    'captação 4K para eventos',
  ]);

  addIf(hasAny(['pl mount', 'pl-mount', 'montagem pl', 'mount pl', ' pl ']), [
    'lentes PL mount',
    'set de cinema profissional',
    'produção de longa metragem',
  ]);

  addIf(hasAny(['e-mount', 'e mount', 'montagem e', 'sony e']), [
    'setup Sony E-Mount',
    'lentes Sony E-Mount',
  ]);

  addIf(hasAny(['b4', '2/3']), [
    'lente B4 broadcast',
    'câmera ENG profissional',
  ]);

  addIf(hasAny(['raw', 'x-ocn', 'xocn']), [
    'workflow RAW cinema',
    'pós-produção avançada',
  ]);

  addIf(hasAny(['hdr']), [
    'workflow HDR',
    'captação cinematográfica HDR',
  ]);

  addIf(hasAny(['dual base iso', 'baixa luz', 'low light', 'pouca luz']), [
    'gravação em baixa luz',
    'câmera para ambiente com pouca luz',
  ]);

  addIf(hasAny(['s-log3', 'slog3', 'log']), [
    'workflow de color grading',
    'produção com latitude de imagem',
  ]);

  addIf(hasAny(['slow motion', '120fps', '180fps', '240fps', 'alta velocidade']), [
    'câmera para slow motion',
    'captação em alta velocidade',
  ]);

  addIf(hasAny(['nd variável', 'nd eletronico', 'nd eletrônico', 'filtros nd', 'nd interno']), [
    'filmagem externa profissional',
    'controle de exposição em set',
  ]);

  addIf(hasAny(['12g-sdi', 'sdi', 'timecode', 'genlock', 'multicâmera', 'multicamera']), [
    'produção multicâmera',
    'operação técnica broadcast',
  ]);

  addIf(hasAny(['broadcast', 'eng', 'jornalismo', 'televisão', 'tv']), [
    'câmera para televisão',
    'câmera para jornalismo',
    'cobertura ao vivo',
  ]);

  addIf(hasAny(['streaming', 'live', 'transmissão', 'transmissao']), [
    'câmera para streaming profissional',
    'transmissão ao vivo profissional',
  ]);

  addIf(hasAny(['documentário', 'documentario']), [
    'câmera para documentário',
    'produção documental profissional',
  ]);

  addIf(hasAny(['publicidade', 'comercial', 'corporativo', 'institucional']), [
    'câmera para publicidade',
    'produção corporativa premium',
  ]);

  addIf(hasAny(['gimbal', 'drone', 'compacto', 'leve']), [
    'câmera para gimbal',
    'produção ágil com câmera compacta',
  ]);

  addIf(hasAny(['rgb']), [
    'iluminação RGB para set',
    'luz criativa para audiovisual',
  ]);

  addIf(hasAny(['bicolor', 'bi-color']), [
    'luz bicolor para filmagem',
    'iluminação para entrevista',
  ]);

  addIf(hasAny(['daylight', '5600k']), [
    'luz daylight para cinema',
    'iluminação principal para set',
  ]);

  addIf(hasAny(['monitor', 'video assist', 'vídeo assist']), [
    'vídeo assist profissional',
    'monitoramento de direção',
  ]);

  addIf(hasAny(['transmissor', 'wireless video', 'sem fio']), [
    'vídeo sem fio para set',
    'transmissão de imagem no set',
  ]);

  addIf(hasAny(['switcher', 'atem', 'multicam', 'multicamera']), [
    'switcher para live streaming',
    'operação multicâmera ao vivo',
  ]);

  addIf(hasAny(['intercom', 'comunicador', 'solidcom']), [
    'comunicação de equipe em set',
    'intercom para produção ao vivo',
  ]);

  addIf(hasAny(['mattebox', 'matte box']), [
    'mattebox para lente cinema',
    'controle de flare em set',
  ]);

  addIf(hasAny(['follow focus', 'foco']), [
    'controle de foco profissional',
    'acessório para assistente de câmera',
  ]);

  addIf(hasAny(['tripé', 'tripe', 'cabeça fluida', 'bowl']), [
    'tripé profissional para câmera',
    'suporte estável para filmagem',
  ]);

  addIf(hasAny(['filtro', 'black mist', 'glimmerglass', 'polarizador', 'nd variável']), [
    'filtro para look cinematográfico',
    'controle de imagem em set',
  ]);

  if (normalizedCategory === 'cameras' || normalizedCategory === 'cameras') {
    suggestions.push('locação de câmera profissional');
  }

  return uniqueSeoLines(suggestions).slice(0, 8);
};

export const getCategorySpecificSeoBrief = (categoryName?: string | null) => {
  const normalizedCategory = normalizeFilterName(categoryName);

  const briefs: Record<string, string> = {
    cameras: `Categoria: CÂMERAS.
Comportamento real de busca: produtoras, DOPs, operadores de câmera, emissoras, eventos, streaming, publicidade, documentários, conteúdo corporativo e igrejas.
Não pense primeiro em ficha técnica. Pense em aplicação de produção, tipo de set e perfil de cliente.
Se for cinema/high-end, priorize cinema digital, publicidade premium, séries, longas, workflow profissional, full frame, PL mount, RAW, CineAlta e Netflix approved somente quando os dados do produto indicarem isso.
Se for broadcast/ENG, priorize televisão, jornalismo, multicâmera, transmissão ao vivo, cobertura de eventos, igrejas, congressos e produção corporativa.
Se for mirrorless/compacta, priorize gimbal, filmmaker, documentário, entrevistas, streaming leve, conteúdo premium e produção ágil.
Boas respostas parecem: câmera para documentário, câmera para publicidade, câmera para transmissão ao vivo, câmera para produtoras, captação multicâmera, câmera para eventos corporativos.`,

    lentes: `Categoria: LENTES.
Comportamento real de busca: DOP, diretor de fotografia, assistente de câmera, produtoras, publicidade, cinema, séries, videoclipes e compatibilidade com câmeras.
Não foque só em milímetros, T-stop ou mount. Pense em look, linguagem visual, kit de lentes, prime/zoom, cobertura de sensor, publicidade e cinema.
Se houver PL, prime, T1.5, full frame ou cinema lens, priorize look cinematográfico, kit prime cinema, lente para publicidade, lente para cinema digital, direção de fotografia e produção premium.
Boas respostas parecem: kit de lentes prime cinema, lente para look cinematográfico, lente para publicidade premium, lente PL para cinema, lente para direção de fotografia.`,

    iluminacao: `Categoria: ILUMINAÇÃO.
Comportamento real de busca: entrevistas, publicidade, cinema, estúdio, videocast, podcast, cursos online, conteúdo corporativo, eventos e set de filmagem.
Não foque só em watts, CRI, RGB ou temperatura de cor. Pense no uso da luz: key light, luz de recorte, luz criativa, setup de entrevista, estúdio, publicidade, cinema e produção corporativa.
Se houver RGB, COB, bicolor ou daylight, traduza em aplicação prática.
Boas respostas parecem: luz para entrevista corporativa, iluminação para videocast, luz para publicidade, iluminação para set de cinema, luz para estúdio de gravação.`,

    audio: `Categoria: ÁUDIO.
Comportamento real de busca: entrevistas, lapela, captação de voz, eventos, podcast, documentário, vídeo corporativo, reportagem, cinema e broadcast.
Não foque em frequência, RF ou ficha técnica. Pense em problema de captação: voz limpa, entrevista, depoimento, apresentador, evento e conteúdo institucional.
Se for lapela, priorize entrevista, vídeo corporativo, evento, documentário, reportagem e depoimento.
Boas respostas parecem: microfone para entrevista, lapela para vídeo corporativo, áudio para eventos, captação de depoimentos, microfone para documentário.`,

    monitores: `Categoria: MONITORES.
Comportamento real de busca: vídeo assist, direção, foco, operador de câmera, DOP, cliente no set, monitoramento de imagem, produção multicâmera e set profissional.
Não foque só em polegadas, brilho ou SDI. Pense em quem usa o monitor e para quê.
Boas respostas parecem: monitor para diretor, vídeo assist profissional, monitor para foco, monitoramento de imagem no set, monitor para produção multicâmera.`,

    transmissores: `Categoria: TRANSMISSORES.
Comportamento real de busca: vídeo sem fio, direção, monitoramento remoto, multicâmera, streaming, broadcast, eventos, set de filmagem e video assist.
Não foque só em alcance, latência ou resolução. Pense em fluxo de produção e monitoramento.
Boas respostas parecem: transmissão de vídeo sem fio, monitoramento remoto no set, vídeo assist sem fio, produção multicâmera, transmissão para direção.`,

    comunicadores: `Categoria: COMUNICADORES.
Comportamento real de busca: intercom, coordenação de equipe, multicâmera, live, broadcast, eventos, switcher, direção, operação técnica e comunicação de set.
Não foque só em número de headsets ou bateria. Pense em coordenação de produção.
Boas respostas parecem: intercom sem fio para eventos, comunicação de equipe técnica, coordenação multicâmera, comunicação para transmissão ao vivo, intercom para set de filmagem.`,

    'tripes de camera': `Categoria: TRIPÉS DE CÂMERA.
Comportamento real de busca: operador de câmera, cabeça fluida, broadcast, documentário, eventos, entrevistas, set profissional e suporte estável de câmera.
Não confundir com tripé de iluminação/C-Stand. Aqui o foco é câmera.
Boas respostas parecem: tripé profissional para câmera, cabeça fluida para filmagem, tripé para broadcast, suporte de câmera para eventos, tripé para entrevistas.`,

    tripes: `Categoria: TRIPÉS DE CÂMERA.
Comportamento real de busca: operador de câmera, cabeça fluida, broadcast, documentário, eventos, entrevistas, set profissional e suporte estável de câmera.
Não confundir com tripé de iluminação/C-Stand. Aqui o foco é câmera.
Boas respostas parecem: tripé profissional para câmera, cabeça fluida para filmagem, tripé para broadcast, suporte de câmera para eventos, tripé para entrevistas.`,

    maquinaria: `Categoria: MAQUINÁRIA / GRIP.
Comportamento real de busca: grip, estrutura de set, montagem de iluminação, suporte para modificadores, butterfly, bandeiras, rebatedores, tubos, garras, segurança e operação de set.
Muito importante: no Brasil, C-Stand também é chamado de Tripé Century. Não tratar como tripé de câmera.
Não foque no nome do acessório. Foque no uso em set.
Boas respostas parecem: grip para iluminação, tripé century para set, suporte para refletor, estrutura para filmagem, montagem de luz em set, suporte para modificadores.`,

    maquinária: `Categoria: MAQUINÁRIA / GRIP.
Comportamento real de busca: grip, estrutura de set, montagem de iluminação, suporte para modificadores, butterfly, bandeiras, rebatedores, tubos, garras, segurança e operação de set.
Muito importante: no Brasil, C-Stand também é chamado de Tripé Century. Não tratar como tripé de câmera.
Não foque no nome do acessório. Foque no uso em set.
Boas respostas parecem: grip para iluminação, tripé century para set, suporte para refletor, estrutura para filmagem, montagem de luz em set, suporte para modificadores.`,

    mattebox: `Categoria: MATTEBOX.
Comportamento real de busca: controle de flare, filtros 4x5.6, filtros ND, polarizador, câmera cinema, mattebox clip-on, configuração de câmera, assistente de câmera e DOP.
Não foque só no modelo. Pense em controle de imagem e compatibilidade com lentes/filtros.
Boas respostas parecem: mattebox para lente cinema, controle de flare em set, suporte para filtros 4x5.6, mattebox para câmera cinema, filtros ND em mattebox.`,

    'follow focus': `Categoria: FOLLOW FOCUS.
Comportamento real de busca: foco remoto, wireless focus, assistente de câmera, 1º AC, cinema, publicidade, gimbal, controle de foco e precisão no set.
Não foque só no modelo. Pense na função operacional.
Boas respostas parecem: foco remoto para cinema, wireless follow focus, controle de foco para gimbal, acessório para assistente de câmera, foco preciso em set.`,

    drones: `Categoria: DRONES.
Comportamento real de busca: filmagem aérea, cinema, publicidade, institucional, eventos, captação premium, drone profissional e produção audiovisual.
Não foque só em modelo ou autonomia. Pense em imagem aérea e tipo de produção.
Boas respostas parecem: filmagem aérea profissional, drone para publicidade, captação aérea para cinema, drone para eventos, imagem aérea para vídeo institucional.`,

    movimento: `Categoria: MOVIMENTO.
Comportamento real de busca: travelling, dolly, slider, movimento de câmera, publicidade, cinema, videoclipe, set de filmagem e direção de fotografia.
Não foque só no equipamento. Pense no efeito visual que ele entrega.
Boas respostas parecem: travelling para cinema, movimento de câmera profissional, dolly para publicidade, slider para set de filmagem, movimento cinematográfico.`,

    switchers: `Categoria: SWITCHERS.
Comportamento real de busca: live streaming, transmissão ao vivo, multicâmera, eventos, igrejas, cursos online, corporativo, palestras, congressos e operação de vídeo.
Não foque só em HDMI/SDI ou ISO. Pense em produção ao vivo.
Boas respostas parecem: switcher para live streaming, transmissão multicâmera, switcher para igreja, produção ao vivo corporativa, gravação multicâmera de eventos.`,

    teleprompter: `Categoria: TELEPROMPTER.
Comportamento real de busca: apresentador, vídeo institucional, curso online, treinamento, lives, entrevistas, política, executivos, gravação corporativa e leitura natural.
Não foque só em tamanho ou tablet. Pense em apresentação diante da câmera.
Boas respostas parecem: teleprompter para vídeo corporativo, prompter para apresentador, gravação de curso online, leitura de roteiro para câmera, teleprompter para entrevistas.`,

    estabilizadores: `Categoria: ESTABILIZADORES.
Comportamento real de busca: gimbal, câmera em movimento, filmagem dinâmica, run and gun, publicidade, eventos, casamento, conteúdo premium, videoclipe e movimento fluido.
Não foque só em carga útil ou modelo. Pense no resultado visual.
Boas respostas parecem: gimbal para câmera profissional, filmagem com movimento fluido, estabilizador para publicidade, gimbal para eventos, câmera em movimento para videoclipe.`,

    filtros: `Categoria: FILTROS.
Comportamento real de busca: ND, polarizador, pro mist, glimmerglass, black mist, look cinematográfico, controle de reflexo, exposição, mattebox e lente.
Não foque só em medida. Pense em efeito visual e controle de imagem.
Boas respostas parecem: filtro ND para filmagem, filtro para look cinematográfico, polarizador para vídeo, controle de reflexo em set, filtro diffusion para cinema.`,

    flash: `Categoria: FLASH.
Comportamento real de busca: fotografia profissional, publicidade, retrato, still, moda, eventos, estúdio e luz fotográfica.
Não foque só em potência. Pense em aplicação fotográfica.
Boas respostas parecem: flash para ensaio fotográfico, iluminação para still, flash para publicidade, luz para fotografia de produto, flash para estúdio.`,
  };

  return briefs[normalizedCategory] || `Categoria não mapeada especificamente.
Analise o produto pelo uso profissional real no mercado audiovisual: quem aluga, para qual produção, em qual situação de set, evento, estúdio ou operação técnica.`;
};
