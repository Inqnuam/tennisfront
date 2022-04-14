<script>
    import Flatpickr from "svelte-flatpickr";
    import { fly } from "svelte/transition";
    import "flatpickr/dist/themes/airbnb.css";
    import { French } from "flatpickr/dist/l10n/fr.js";
    import { players, countries } from "../stores.js";

    export let player = null;

    const pickrOptions = {
        locale: French,
        defaultDate: new Date(),
        dateFormat: "d M Y",
        maxDate: new Date(),
    };
</script>

{#if player}
    <div class="d-flex">
        <div class="me-3">
            <div class="input-group mb-1">
                <span class="input-group-text">Nom</span>
                <input type="text" class="form-control" placeholder="Sharapova" aria-label="Nom du joueur" bind:value={player.lastname} />
            </div>
            <div class="input-group mb-1">
                <span class="input-group-text">Prénom</span>
                <input type="text" class="form-control" placeholder="Maria" aria-label="Prénom du joueur" bind:value={player.firstname} />
            </div>
            <div class="input-group mb-1">
                <span class="input-group-text">Date de naissance</span>

                <Flatpickr class="form-control" role="button" options={pickrOptions} bind:value={player.birthday} />
            </div>

            <div class="input-group mb-1">
                <span class="input-group-text">Sexe</span>
                <select class="form-select" aria-label="Choisir le sexe" bind:value={player.sex}>
                    <option value="F">Feminin</option>
                    <option value="M">Masculin</option>
                </select>
            </div>

            <div class="input-group mb-1">
                <span class="input-group-text">Poids (grammes)</span>
                <input type="number" min="1000" class="form-control" placeholder="71000" aria-label="Poids du joueur en grammes" bind:value={player.data.weight} />
            </div>

            <div class="input-group mb-3">
                <span class="input-group-text">Taille (cm)</span>
                <input type="number" min="20" class="form-control" placeholder="170" aria-label="Taille du joueur en grammes" bind:value={player.data.height} />
            </div>

            <div>
                <label for="playerPhoto" class="form-label">Lien de la photo du joueur:</label>
                <textarea placeholder="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Flickr_-_Carine06_-_Maria_Sharapova_%281%29.jpg/1280px-Flickr_-_Carine06_-_Maria_Sharapova_%281%29.jpg" class="form-control" id="playerPhoto" bind:value={player.picture} />
            </div>
        </div>

        <div>
            <div class="input-group mb-1">
                <span class="input-group-text">Classement {player.sex === "F" ? "WTP" : "ATP"}</span>
                <input type="number" min="1" class="form-control" placeholder="1" aria-label="Classement {player.sex === 'F' ? 'WTP' : 'ATP'}" bind:value={player.data.rank} />
            </div>

            <div class="input-group mb-1">
                <span class="input-group-text">Points gagnés</span>
                <input type="number" min="0" class="form-control" placeholder="0" aria-label="Points gagnés" bind:value={player.data.points} />
            </div>

            <div class="mt-2">
                <label class="form-label" for="">Derniers résultats:</label>
                {#each player.data.last as el, i}
                    <div in:fly|local={{ y: 50, duration: 250 }} class="input-group input-group-sm mb-1">
                        <select class="form-select shadow-none" bind:value={el}>
                            <option value={1}>Victoire</option>
                            <option value={0}>Défaite</option>
                        </select>
                        <button
                            class="btn btn-sm btn-danger shadow-none"
                            on:click={() => {
                                player.data.last.splice(i, 1);
                                player = player;
                            }}>X</button
                        >
                    </div>
                {/each}
                <button
                    class="btn btn-sm btn-primary shadow-none"
                    on:click={() => {
                        player.data.last.push(0);
                        player = player;
                    }}>+</button
                >
            </div>
        </div>
    </div>

    <hr />
    <div>
        <div class="mb-2">
            <label for="countryFlag" class="form-label">Lien de l'image du drapeau du pays:</label>
            <textarea placeholder="https://drapeaux.pays/rus.png" class="form-control" id="countryFlag" bind:value={player.country.picture} />
        </div>

        <div class="input-group mb-2">
            <span class="input-group-text">Code du pays</span>
            <input list="countriesCodes" type="text" minlength="3" maxlength="3" class="form-control" placeholder="RUS" aria-label="Code représantant le pays du joueur" bind:value={player.country.code} />
        </div>
    </div>

    <datalist id="countriesCodes">
        {#each Object.keys($countries) as code}
            <option value={code}>{$countries[code]}</option>
        {/each}
    </datalist>
{/if}
