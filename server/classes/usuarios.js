class Usuarios {
    constructor() {
        this.personas = []
    }

    agregarPersonas(id, nombre, sala) {
        let persona = { id, nombre, sala }
        this.personas.push(persona)
        return this.personas
    }

    getPersona(id) {
        let persona = this.personas.filter(per => per.id === id)[0]
        return persona
    }
    getPersonas() {
        return this.personas
    }

    getPersonaSala(sala) {
        let persona = this.personas.filter(per => per.sala === sala)
        return persona
    }
    borrarPersona(id) {
        let persona = this.getPersona(id)
        this.personas = this.personas.filter(per => per.id != id)
        return persona
    }
}

module.exports = { Usuarios }