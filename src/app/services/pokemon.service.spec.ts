import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PokemonService } from './pokemon.service';


describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://pokeapi.co/api/v2';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService]
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ao final de cada teste, verifica se não há requisições pendentes
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Teste para o método getPokemonList
  it('should fetch a list of pokemons using getPokemonList', () => {
    const mockPokemonList = {
      count: 1,
      next: '',
      previous: null,
      results: [{ name: 'bulbasaur', url: `${baseUrl}/pokemon/1/` }]
    };

    service.getPokemonList(0, 20).subscribe(response => {
      expect(response.results.length).toBe(1);
      expect(response.results[0].name).toBe('bulbasaur');
    });

    const req = httpMock.expectOne(`${baseUrl}/pokemon?offset=0&limit=20`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPokemonList);
  });

  // Teste para o método getPokemonDetails
  it('should fetch pokemon details using getPokemonDetails', () => {
    const mockPokemonDetails = {
      id: 1,
      name: 'bulbasaur',
      species: { url: '' },
      sprites: { other: { 'official-artwork': { front_default: '' } } },
      types: [],
      abilities: [],
      stats: [],
      height: 0,
      weight: 0
    };

    const pokemonName = 'bulbasaur';
    service.getPokemonDetails(pokemonName).subscribe(details => {
      expect(details.id).toBe(1);
      expect(details.name).toBe('bulbasaur');
    });

    const req = httpMock.expectOne(`${baseUrl}/pokemon/${pokemonName}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPokemonDetails);
  });

});