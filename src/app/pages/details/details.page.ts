import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { PokemonService, PokemonDetails } from 'src/app/services/pokemon.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class DetailsPage implements OnInit {
  pokemon: PokemonDetails | null = null;
  isFavorite = false;
  evolutions: any[] = [];
  weaknesses: string[] = [];
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

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private favoriteService: FavoriteService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    const pokemonId = this.route.snapshot.paramMap.get('id');
    if (pokemonId) {
      this.pokemonService.getPokemonDetails(pokemonId).pipe(
        switchMap(details => {
          this.pokemon = details;
          this.favoriteService.isFavorite(details.id).then(isFav => this.isFavorite = isFav);

          const species$ = this.pokemonService.getGeneric(details.species.url);
          const types$ = details.types.map(t => this.pokemonService.getType(t.type.name));

          return forkJoin({ species: species$, types: forkJoin(types$) });
        })
      ).subscribe(({ species, types }) => {
        const damageRelations = (types as any[]).flatMap((t: any) => t.damage_relations.double_damage_from);
        this.weaknesses = [...new Set(damageRelations.map((dr: any) => dr.name))];

        if (species.evolution_chain?.url) {
          this.pokemonService.getGeneric(species.evolution_chain.url).subscribe(evoChain => {
            this.evolutions = this.parseEvolutionChain(evoChain.chain);
            this.isLoading = false;
          });
        } else {
          this.isLoading = false;
        }
      });
    }
  }

  getTypeColor(typeName: string): string {
    const color = this.colors[typeName.toLowerCase()];
    return color ? color.base : this.colors['normal'].base;
  }

  private parseEvolutionChain(chain: any): any[] {
    let evolutions = [];
    let current = chain;
    while (current) {
      const urlParts = current.species.url.split('/');
      const id = urlParts[urlParts.length - 2];
      evolutions.push({ name: current.species.name, id });
      current = current.evolves_to[0];
    }
    return evolutions;
  }

  async toggleFavorite() {
    if (!this.pokemon) return;

    this.isFavorite = !this.isFavorite;
    if (this.isFavorite) {
      await this.favoriteService.favoritePokemon(this.pokemon.id);
      this.presentToast('Adicionado aos favoritos!');
    } else {
      await this.favoriteService.unfavoritePokemon(this.pokemon.id);
      this.presentToast('Removido dos favoritos!');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'primary'
    });
    await toast.present();
  }
}