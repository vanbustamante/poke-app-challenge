import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { forkJoin, of } from 'rxjs';
import { FavoriteService } from '../services/favorite.service';
import { PokemonService, PokemonDetails } from '../services/pokemon.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class Tab2Page {
  favoritePokemons: PokemonDetails[] = [];
  isLoading = false; 

  constructor(
    private favoriteService: FavoriteService,
    private pokemonService: PokemonService
  ) {}

 
  ionViewWillEnter() {
    this.loadFavoritePokemons();
  }

  async loadFavoritePokemons() {
    this.isLoading = true;
    const favoriteIds = await this.favoriteService.getAllFavoritePokemons();

    if (favoriteIds.length === 0) {
      this.favoritePokemons = [];
      this.isLoading = false;
      return;
    }

   
    const requests = favoriteIds.map(id => this.pokemonService.getPokemonDetails(id.toString()));

    forkJoin(requests).subscribe(pokemonDetails => {
      this.favoritePokemons = pokemonDetails;
      this.isLoading = false;
    });
  }
}