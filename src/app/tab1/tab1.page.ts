// src/app/tab1/tab1.page.ts (com console.logs para depuração)

import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular';
import { PokemonService } from '../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface PokemonListItem {
  name: string;
  url: string;
  id: string;
  imageUrl: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class Tab1Page implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;
  pokemons: PokemonListItem[] = [];
  offset = 0;
  limit = 20;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    console.log('🕵️‍♂️ 1. Componente iniciado, chamando loadPokemons...');
    this.loadPokemons();
  }

  loadPokemons(event?: InfiniteScrollCustomEvent) {
    this.pokemonService.getPokemonList(this.offset, this.limit).subscribe(res => {
      // --- PISTA 1: A API RESPONDEU? ---
      console.log('✅ 2. Resposta da API recebida:', res);

      const detailedPokemons: PokemonListItem[] = res.results.map(poke => {
        const id = poke.url.split('/')[6];
        return {
          ...poke,
          id: id,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        };
      });

      // --- PISTA 2: OS DADOS FORAM MAPEADOS? ---
      console.log('🗺️ 3. Pokémons mapeados (transformados):', detailedPokemons);

      this.pokemons = [...this.pokemons, ...detailedPokemons];

      // --- PISTA 3: O ARRAY DO COMPONENTE FOI ATUALIZADO? ---
      console.log('📦 4. Estado final do array `this.pokemons`:', this.pokemons);

      if (event) {
        event.target.complete();
      }

      if (this.infiniteScroll && this.pokemons.length >= res.count) {
        this.infiniteScroll.disabled = true;
      }
    });
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.offset += this.limit;
    this.loadPokemons(event);
  }
}