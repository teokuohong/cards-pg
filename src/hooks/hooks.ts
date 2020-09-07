interface ICards {
    [key: string]: string
}

const priceUpdate = async (paramsTCG: ICards[], paramsScry: ICards[], set: string) => {

    return await new Promise<{}[]>((resolve) => {

        let updatedPrices: {}[] = []

        import(`../ratio/${set}.json`)
            .then((module) => {
                let ratioObject = module.default;

                for (let i = 1; i <= ratioObject['cards']; i++) {
                    let tcgCards = paramsTCG.find(item => parseInt(item['number']) === i && item['rarity'].toLowerCase() !== 't'); //Locate cards according to collector number
                    let scryCards = paramsScry.find(item => parseInt(item['collector number']) === i); //Locate cards according to collector number

                    if (tcgCards && scryCards) {
                        let mapTCGToRatioR = parseFloat(tcgCards['listed median'].replace('$', '')) * ratioObject[tcgCards['rarity'].toLowerCase()]['regular'];
                        let mapScryToRatioR = parseFloat(scryCards['usd']) * ratioObject[tcgCards['rarity'].toLowerCase()]['regular']

                        let mapScryToRatioF = parseFloat(scryCards['usd_foil']) * ratioObject[tcgCards['rarity'].toLowerCase()]['foil'];

                        updatedPrices.push({
                            name: scryCards['name'],
                            set: set.toUpperCase(),
                            type: 'regular',
                            price: (mapTCGToRatioR + mapScryToRatioR) / 2
                        }, {
                            name: scryCards['name'],
                            set: set.toUpperCase(),
                            type: 'foil',
                            price: mapScryToRatioF
                        })
                    }
                };
            });

        console.log(updatedPrices)

        return resolve(updatedPrices);
    })
};

export default priceUpdate;