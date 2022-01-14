const NftOffer = require("../models/NftOffer");

const offerNftController = {
    // controlador publico pero depende de la validacion (depende del rol lo que se MUESTRA por ende se controla en el frontend)
    getAllOffers: async (req, res) => {
        try {
            const offers = await NftOffer.find().populate('user')
            res.json({ success: true, response: offers })
        } catch (error) {
            res.json({ success: false, respuesta: "Oops! error" })
        }
    },
    // controlador privado dependiendo de la suscripcion 
    postOffer: async (req, res) => {
        const offerBody = req.body
        let offer
        try {
            if (req.user.role === 'admin' || req.user.role === 'moderator' || req.user.suscription) {
                offer = await new NftOffer(offerBody).save()
                res.json({ response: offer })
            } else {
                res.json({ success: false })
            }

        } catch (error) {
            console.log(error);
            res.json({ success: false, respuesta: "Oops! error" })
        }
    },
    getOneOffer: async (req, res) => {
        let offer;
        const id = req.params.id;
        try {
            offer = await NftOffer.findOne({ _id: id }).populate('user')
            res.json({ response: offer, success: true });
        } catch (error) {

            res.json({ success: false, respuesta: "Oops! error" })
        }
    },
    // controlador privado, dependiendo de la suscription
    modifyOffer: async (req, res) => {
        let id = req.params.id;
        let offerBody = req.body;
        let offer;
        try {
            if (req.user.role === 'admin' || req.user.role === 'moderator' || req.user.suscription) {

                if (req.user.role === 'user') {
                    // no debe permitir cambiar la validez de la oferta 
                    if (!req.body.valid) {
                        offer = await NftOffer.findOneAndUpdate({ user: req.user._id }, offerBody, { new: true });
                        res.json({ offerUpdatedId: offer._id })
                    }
                } else {
                    offer = await NftOffer.findOneAndUpdate({ _id: id }, offerBody, { new: true });
                    res.json({ offerUpdatedId: offer._id })
                }

            } else {
                res.json({ success: false })
            }
        } catch (error) {
            console.log(error);
        }
    },
    // controlador privado, dependiendo de la suscription
    deleteOffer: async (req, res) => {
        const id = req.params.id;
        let offerDeleted;
        try {
            if (req.user.role === 'admin' || req.user.role === 'moderator' || req.user.suscription) {

                if (!req.user.offers.includes(id) && req.user.role === 'user') return res.json({ msg: 'Incorrect user' });

                if (req.user.role === 'user' && req.user.offers.includes(id)) {
                    offerDeleted = await NftOffer.findOneAndDelete({ _id: id });
                    res.json({ success: true, deletedOfferId: offerDeleted._id });
                } else {
                    offerDeleted = await NftOffer.findOneAndDelete({ _id: id });
                    res.json({ success: true, deletedOfferId: offerDeleted._id });
                }

            } else {
                res.json({ success: false });
            }
        } catch (error) {
            console.log(error);
        }

    },
    getOffersByUser: async (req, res) => {
        const id = req.params.id
        try {
            if (req.user.role === 'admin' || req.user.role === 'moderator' || req.user.suscription) {
                const offersByUser = await NftOffer.find({ users: id }).populate('user')
                res.json({ succes: true, response: offersByUser })

            } else {
                res.json({ succes: false, msg: 'Unauthorized user' })
            }

        } catch (error) {
            console.log(error);
            res.json({ error: 'Error in the comunication' })
        }
    },


}

module.exports = offerNftController;