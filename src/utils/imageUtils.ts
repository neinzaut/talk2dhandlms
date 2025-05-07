export type SignType = 'labelled' | 'unlabelled' | 'letter' | 'number';

export interface SignImage {
    path: any;
    meaning?: string;
}

// Static mapping of sign images
const signImageMap: Record<string, any> = {
    // ASL Labelled Signs
    'asl-labelled-a': require('../assets/images/asl-labelled/a.png'),
    'asl-labelled-b': require('../assets/images/asl-labelled/b.png'),
    'asl-labelled-c': require('../assets/images/asl-labelled/c.png'),
    'asl-labelled-d': require('../assets/images/asl-labelled/d.png'),
    'asl-labelled-e': require('../assets/images/asl-labelled/e.png'),
    'asl-labelled-f': require('../assets/images/asl-labelled/f.png'),
    'asl-labelled-g': require('../assets/images/asl-labelled/g.png'),
    'asl-labelled-h': require('../assets/images/asl-labelled/h.png'),
    'asl-labelled-i': require('../assets/images/asl-labelled/i.png'),
    'asl-labelled-j': require('../assets/images/asl-labelled/j.png'),
    'asl-labelled-k': require('../assets/images/asl-labelled/k.png'),
    'asl-labelled-l': require('../assets/images/asl-labelled/l.png'),
    'asl-labelled-m': require('../assets/images/asl-labelled/m.png'),
    'asl-labelled-n': require('../assets/images/asl-labelled/n.png'),
    'asl-labelled-o': require('../assets/images/asl-labelled/o.png'),
    'asl-labelled-p': require('../assets/images/asl-labelled/p.png'),
    'asl-labelled-q': require('../assets/images/asl-labelled/q.png'),
    'asl-labelled-r': require('../assets/images/asl-labelled/r.png'),
    'asl-labelled-s': require('../assets/images/asl-labelled/s.png'),
    'asl-labelled-t': require('../assets/images/asl-labelled/t.png'),
    'asl-labelled-u': require('../assets/images/asl-labelled/u.png'),
    'asl-labelled-v': require('../assets/images/asl-labelled/v.png'),
    'asl-labelled-w': require('../assets/images/asl-labelled/w.png'),
    'asl-labelled-x': require('../assets/images/asl-labelled/x.png'),
    'asl-labelled-y': require('../assets/images/asl-labelled/y.png'),
    'asl-labelled-z': require('../assets/images/asl-labelled/z.png'),

    // ASL Number Signs
    'asl-labelled-0': require('../assets/images/asl-labelled/0.png'),
    'asl-labelled-1': require('../assets/images/asl-labelled/1.png'),
    'asl-labelled-2': require('../assets/images/asl-labelled/2.png'),
    'asl-labelled-3': require('../assets/images/asl-labelled/3.png'),
    'asl-labelled-4': require('../assets/images/asl-labelled/4.png'),
    'asl-labelled-5': require('../assets/images/asl-labelled/5.png'),
    'asl-labelled-6': require('../assets/images/asl-labelled/6.png'),
    'asl-labelled-7': require('../assets/images/asl-labelled/7.png'),
    'asl-labelled-8': require('../assets/images/asl-labelled/8.png'),
    'asl-labelled-9': require('../assets/images/asl-labelled/9.png'),
    'asl-labelled-10': require('../assets/images/asl-labelled/10.png'),

    // FSL Labelled Signs
    'fsl-labelled-a': require('../assets/images/fsl-labelled/a.png'),
    'fsl-labelled-b': require('../assets/images/fsl-labelled/b.png'),
    'fsl-labelled-c': require('../assets/images/fsl-labelled/c.png'),
    'fsl-labelled-d': require('../assets/images/fsl-labelled/d.png'),
    'fsl-labelled-e': require('../assets/images/fsl-labelled/e.png'),
    'fsl-labelled-f': require('../assets/images/fsl-labelled/f.png'),
    'fsl-labelled-g': require('../assets/images/fsl-labelled/g.png'),
    'fsl-labelled-h': require('../assets/images/fsl-labelled/h.png'),
    'fsl-labelled-i': require('../assets/images/fsl-labelled/i.png'),
    'fsl-labelled-j': require('../assets/images/fsl-labelled/j.png'),
    'fsl-labelled-k': require('../assets/images/fsl-labelled/k.png'),
    'fsl-labelled-l': require('../assets/images/fsl-labelled/l.png'),
    'fsl-labelled-m': require('../assets/images/fsl-labelled/m.png'),
    'fsl-labelled-n': require('../assets/images/fsl-labelled/n.png'),
    'fsl-labelled-o': require('../assets/images/fsl-labelled/o.png'),
    'fsl-labelled-p': require('../assets/images/fsl-labelled/p.png'),
    'fsl-labelled-q': require('../assets/images/fsl-labelled/q.png'),
    'fsl-labelled-r': require('../assets/images/fsl-labelled/r.png'),
    'fsl-labelled-s': require('../assets/images/fsl-labelled/s.png'),
    'fsl-labelled-t': require('../assets/images/fsl-labelled/t.png'),
    'fsl-labelled-u': require('../assets/images/fsl-labelled/u.png'),
    'fsl-labelled-v': require('../assets/images/fsl-labelled/v.png'),
    'fsl-labelled-w': require('../assets/images/fsl-labelled/w.png'),
    'fsl-labelled-x': require('../assets/images/fsl-labelled/x.png'),
    'fsl-labelled-y': require('../assets/images/fsl-labelled/y.png'),
    'fsl-labelled-z': require('../assets/images/fsl-labelled/z.png'),

    // FSL Number Signs
    'fsl-labelled-0': require('../assets/images/fsl-labelled/0.png'),
    'fsl-labelled-1': require('../assets/images/fsl-labelled/1.png'),
    'fsl-labelled-2': require('../assets/images/fsl-labelled/2.png'),
    'fsl-labelled-3': require('../assets/images/fsl-labelled/3.png'),
    'fsl-labelled-4': require('../assets/images/fsl-labelled/4.png'),
    'fsl-labelled-5': require('../assets/images/fsl-labelled/5.png'),
    'fsl-labelled-6': require('../assets/images/fsl-labelled/6.png'),
    'fsl-labelled-7': require('../assets/images/fsl-labelled/7.png'),
    'fsl-labelled-8': require('../assets/images/fsl-labelled/8.png'),
    'fsl-labelled-9': require('../assets/images/fsl-labelled/9.png'),
    'fsl-labelled-10': require('../assets/images/fsl-labelled/10.png'),
};

export const getSignImage = (language: 'ASL' | 'FSL', sign: string, type: SignType): SignImage => {
    // For letters and numbers, return null as they don't have sign icons
    if (type === 'letter' || type === 'number') {
        return {
            path: null,
            meaning: sign
        };
    }

    // Get the image from the static mapping
    const key = `${language.toLowerCase()}-${type}-${sign.toLowerCase()}`;
    const image = signImageMap[key];

    return {
        path: image || null,
        meaning: type === 'labelled' ? sign : undefined
    };
};

export const getSignImages = (language: 'ASL' | 'FSL', signs: string[], type: SignType): SignImage[] => {
    return signs.map(sign => getSignImage(language, sign, type));
}; 