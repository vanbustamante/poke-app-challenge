
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PokemonListResponse {
  count: number;
  next: string;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

export interface PokemonDetails {
  id: number;
  name:string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}


@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  // Método para buscar a lista de pokémons com paginação
  getPokemonList(offset: number, limit: number): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`<span class="math-inline">\{this\.baseUrl\}/pokemon?offset\=</span>{offset}&limit=${limit}`);
  }

  // Método para buscar os detalhes de um pokémon pelo nome ou ID
  getPokemonDetails(idOrName: string): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(`<span class="math-inline">\{this\.baseUrl\}/pokemon/</span>{idOrName}`);
  }
}