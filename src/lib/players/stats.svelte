<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { api } from "../tools/api.js";
    import { countries } from "../stores";
    import Imc from "../resources/icones/imc.svelte";
    import PlayerSize from "../resources/icones/playerSize.svelte";

    import { fly } from "svelte/transition";
    export let isLoading = false;
    const dispatch = createEventDispatcher();

    let data = null;
    onMount(() => {
        isLoading = true;
        data = null;
        api("GET", "/tasks/task3")
            .then((res) => {
                data = res;
            })
            .catch((err) => {
                dispatch("error", {
                    msg: err.error.cli,
                });
            })
            .finally(() => {
                isLoading = false;
            });
    });
</script>

{#if data}
    <div in:fly>
        <div class="d-flex mb-3">
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img
                width="80"
                src={data.bestCountry.picture}
                on:error={(e) => {
                    e.target.src = "https://countryflagsapi.com/png/" + data.bestCountry.code.toLowerCase();
                }}
                class="rounded float-start border me-2"
                alt="Drapeau du meilleur pays"
            />
            <div class="d-flex flex-column">
                <span>Le meilleur pays est {$countries[data.bestCountry.code.toUpperCase()] ?? data.bestCountry.code}</span>
                <span>Avec {data.bestCountry.ratio} victoires par joueur</span>
            </div>
        </div>

        <div class="d-flex mb-3">
            <span class="me-2 border">
                <Imc />
            </span>

            <span>L'IMC moyen des joueurs est {data.averageIMC}</span>
        </div>

        <div class="d-flex">
            <span class="me-2 border">
                <PlayerSize />
            </span>

            <span>La median de la taille des joeurs est de {data.medianSize} cm</span>
        </div>
    </div>
{:else if isLoading}
    <div class="progress">
        <div class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" />
    </div>
{/if}
