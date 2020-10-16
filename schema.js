const axios = require("axios");

const {GraphQLObjectType, GraphQLString, GraphQLList, graphql, GraphQLScalarType, GraphQLSchema} = require("graphql")

const CountryType = new GraphQLObjectType({
    name:"Country",
    fields:()=>({
        name : { type: GraphQLString },
        flag : { type : GraphQLString },
        alpha3Code : { type : GraphQLString },
        nativeName : { type : GraphQLString },
        population : { type : GraphQLString },
        region : { type : GraphQLString },
        subregion : { type : GraphQLString },
        capital : { type : GraphQLString },
        topLevelDomain : { type : GraphQLList(GraphQLString) },
        currencies : { type : GraphQLList(CurrencyType) },
        languages : { type : GraphQLList(LanguageType) },
        borders : {type : GraphQLList(GraphQLString)}
    })
});

const CurrencyType = new GraphQLObjectType({
    name : "Currency",
    fields : ()=>({
        code : { type:GraphQLString }
    })
});

const LanguageType = new GraphQLObjectType({
    name : "Language",
    fields : ()=>({
        name : { type : GraphQLString }
    })
})

const BorderType = new GraphQLObjectType({
    name : "Border",
    fields : ()=>({
        name : { type : GraphQLString }
    })
})

const RootQuerry = new GraphQLObjectType ({
    name : 'RootQuerry',
    fields:{
        countries:{
            type : new GraphQLList(CountryType),
            resolve(parent,args){
                console.log("countries")
                return axios.get("https://restcountries.eu/rest/v2/all")
                .then(res=>res.data);
            }
        },
        country:{
            type : CountryType,
            args :{
                name : {type :GraphQLString}
            },
            resolve(parent,args){
                return axios.get(`https://restcountries.eu/rest/v2/name/${args.name}`)
                .then(async(res)=>{
                    let data = new Object(res.data[0])
                    data.borders = await axios.get(`https://restcountries.eu/rest/v2/alpha?codes=${res.data[0].borders.join(";")}`)
                    .then(res=> {
                        return res.data.map(e=>e.name)
                    })
                    return data
                });
            }
        },
        countriesSearch:{
            type : new GraphQLList(CountryType),
            args:{
                name : { type : GraphQLString}
            },
            resolve(parent,args){
                return axios.get(`https://restcountries.eu/rest/v2/name/${args.name}`)
                .then((res)=>res.data);
            }
        },
        countriesByRegion:{
            type : new GraphQLList(CountryType),
            args:{
                name : { type : GraphQLString}
            },
            resolve(parent,args){
                return axios.get(`https://restcountries.eu/rest/v2/region/${args.name}`)
                .then((res)=>res.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query : RootQuerry
});

/*


        languages:{
            type:new GraphQLList(LanguageType),
            resolve(parent,args){
                console.log("languages")
                return parent.languages
            }
        },
        currencies : {
            type : new GraphQLList(CurrencyType),
            resolve(parent,args){
                console.log("currencies")
                return parent.currencies
            }
        },
        borders:{
            type : new GraphQLList(BorderType),
            resolve(parent,args){
                console.log("borders")
                return axios.get(`https://restcountries.eu/rest/v2/alpha?codes=dza`)
                .then(res=>{
                    return res.data
                })
            }
        }





Country 
name                : String
flag                : String
alpha3Code          : String
nativeName          : String
Population          : String
region              : String
subregion           : String
Capital             : String
TopLevelDomain      : String
Currencies          : [Currency]
Languages           : [Language] 
borders     : [Country]


Language 
name                : String

Currency
code                : String

[
  {
    "name": "Algeria",
    "topLevelDomain": [
      ".dz"
    ],
    "capital": "Algiers",
    "region": "Africa",
    "subregion": "Northern Africa",
    "population": 40400000,
    "borders": [
      "TUN",
      "LBY",
      "NER",
      "ESH",
      "MRT",
      "MLI",
      "MAR"
    ],
    "nativeName": "الجزائر",
    "currencies": [
      {
        "code": "DZD",
        "name": "Algerian dinar",
        "symbol": "د.ج"
      }
    ],
    "languages": [
      {
        "iso639_1": "ar",
        "iso639_2": "ara",
        "name": "Arabic",
        "nativeName": "العربية"
      }
    ],
    "flag": "https://restcountries.eu/data/dza.svg",
  }
]



*/