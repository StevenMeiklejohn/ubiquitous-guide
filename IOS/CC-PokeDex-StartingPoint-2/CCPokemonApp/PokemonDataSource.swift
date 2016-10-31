import Foundation
import Alamofire
import BrightFutures
import Argo
import Curry

class PokemonDataSource {
    
    private let baseURL = "http://www.pokeapi.co/"
    private var URL: String {
        return baseURL + "api/v1/pokedex/1"
    }
    
    private func getAllPokemon() -> Future<[PokemonSummary], NSError> {
        return Alamofire.request(.GET, URL).responseFutureJSON()
            .flatMap() { value -> Future<[PokemonSummary], NSError> in
                switch Pokedex.decode(value) {
                case .Success(let pokedex):
                    return Future<[PokemonSummary], NSError>(value: pokedex.pokemon)
                case .Failure(let error):
                    return Future<[PokemonSummary], NSError>(error: NSError(domain: "error.decode", code: error._code, userInfo: ["description" : error.description]))
                }
            }
    }
    
    func getFirst150Pokemon() -> Future<[PokemonSummary], NSError> {
        return getAllPokemon().map { summaries in
            return summaries.filter { $0.id <= 150 }.sort { $0.id < $1.id }
        }
    }
}

extension Alamofire.Request {
    
    func responseFutureJSON() -> Future<JSON, NSError> {
        let promise = Promise<JSON, NSError>()
        
        responseJSON { response in
            switch response.result {
            case .Success(let value):
                promise.success(JSON(value))
            case .Failure(let error):
                promise.failure(error)
            }
        }
        
        return promise.future
    }

}

struct PokemonSummary {
    let name: String
    private let uri: String
    
    var id: Int {
        // n.b. this is not good code. never do this.
        let components = uri.componentsSeparatedByString("/")
        let secondLastIndex = components.count - 2
        return Int(components[secondLastIndex]) ?? 0
    }
}

extension PokemonSummary: Decodable {
    static func decode(json: JSON) -> Decoded<PokemonSummary> {
        return curry(PokemonSummary.init)
            <^> json <| "name"
            <*> json <| "resource_uri"
    }
}

struct Pokedex {
    let pokemon: [PokemonSummary]
}

extension Pokedex: Decodable {
    static func decode(json: JSON) -> Decoded<Pokedex> {
        return curry(Pokedex.init)
            <^> json <|| "pokemon"
    }
}