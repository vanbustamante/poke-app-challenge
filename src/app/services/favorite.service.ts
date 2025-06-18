import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const STORAGE_KEY = 'favoritePokemons';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    if (this._storage) {
      return;
    }
    this._storage = await this.storage.create();
  }

  async getAllFavoritePokemons(): Promise<number[]> {
    return (await this._storage?.get(STORAGE_KEY)) || [];
  }

  async isFavorite(pokemonId: number): Promise<boolean> {
    const favorites = await this.getAllFavoritePokemons();
    return favorites.includes(pokemonId);
  }

  async favoritePokemon(pokemonId: number): Promise<void> {
    const favorites = await this.getAllFavoritePokemons();
    if (!favorites.includes(pokemonId)) {
      favorites.push(pokemonId);
      await this._storage?.set(STORAGE_KEY, favorites);
    }
  }

  async unfavoritePokemon(pokemonId: number): Promise<void> {
    let favorites = await this.getAllFavoritePokemons();
    favorites = favorites.filter(id => id !== pokemonId);
    await this._storage?.set(STORAGE_KEY, favorites);
  }
}