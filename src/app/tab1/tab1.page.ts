// src/app/tab1/tab1.page.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular';
import { PokemonService, PokemonDetails } from '../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class Tab1Page implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;
  pokemons: PokemonDetails[] = [];
  private allPokemons: PokemonDetails[] = [];
  offset = 0;
  limit = 20;
  isLoading = true;

  private colors: { [key: string]: { base: string; contrast: string; } } = {
    grass:    { base: '#78C850', contrast: '#ffffff' },
    fire:     { base: '#F08030', contrast: '#ffffff' },
    water:    { base: '#6890F0', contrast: '#ffffff' },
    bug:      { base: '#A8B820', contrast: '#ffffff' },
    normal:   { base: '#A8A878', contrast: '#ffffff' },
    poison:   { base: '#A040A0', contrast: '#ffffff' },
    electric: { base: '#F8D030', contrast: '#000000' },
    ground:   { base: '#E0C068', contrast: '#000000' },
    fairy:    { base: '#EE99AC', contrast: '#000000' },
    fighting: { base: '#C03028', contrast: '#ffffff' },
    psychic:  { base: '#F85888', contrast: '#ffffff' },
    rock:     { base: '#B8A038', contrast: '#ffffff' },
    ghost:    { base: '#705898', contrast: '#ffffff' },
    ice:      { base: '#98D8D8', contrast: '#000000' },
    dragon:   { base: '#7038F8', contrast: '#ffffff' },
    steel:    { base: '#B8B8D0', contrast: '#000000' },
    dark:     { base: '#705848', contrast: '#ffffff' },
    flying:   { base: '#A890F0', contrast: '#ffffff' },
  };

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPokemons();
  }

  getTypeColor(typeName: string): string {
    const color = this.colors[typeName.toLowerCase()];
    return color ? color.base : this.colors['normal'].base; 
  }

  loadPokemons(event?: InfiniteScrollCustomEvent) {
    this.isLoading = !event;

    this.pokemonService.getPokemonList(this.offset, this.limit).subscribe(listRes => {
      const detailRequests = listRes.results.map(poke =>
        this.pokemonService.getPokemonDetails(poke.name)
      );

      forkJoin(detailRequests)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            if (event) event.target.complete();
          })
        )
        .subscribe(detailsRes => {
          this.allPokemons.push(...detailsRes);
          this.pokemons = [...this.allPokemons];
          if (this.infiniteScroll && this.pokemons.length >= listRes.count) {
            this.infiniteScroll.disabled = true;
          }
        });
    });
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.offset += this.limit;
    this.loadPokemons(event);
  }

  handleSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.pokemons = this.allPokemons.filter(p => {
      return p.name.toLowerCase().includes(query);
    });
  }
}