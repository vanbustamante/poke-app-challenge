
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
  name: string;
  height: number;
  weight: number;
  species: { url: string; };
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

  getPokemonList(offset: number, limit: number): Observable<PokemonListResponse> {

    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`);
  }

  getPokemonDetails(idOrName: string): Observable<PokemonDetails> {

    return this.http.get<PokemonDetails>(`${this.baseUrl}/pokemon/${idOrName}`);
  }
  
  getSpecies(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getType(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/type/${name}`);
  }

  getGeneric(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
}