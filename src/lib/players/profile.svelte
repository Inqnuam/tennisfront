<script>
    import { countries } from "../stores.js";
    export let player = null;
</script>

{#if player}
    <div class="d-flex">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
            width="300"
            src={player.picture}
            on:error={(e) => {
                e.target.src = "https://cdn-icons-png.flaticon.com/512/76/76723.png";
            }}
            class="rounded float-start border me-2"
            alt="Photo du joueur"
        />
        <div class="d-flex flex-column">
            <span>Age: {player.data.age}</span>
            <span>Sexe: {player.sex === "F" ? "feminin" : "masculin"}</span>
            <span>Poids: {player.data.weight / 1000}kg</span>
            <span>Taille: {player.data.height}cm</span>
            <span>Pays: {$countries[player.country.code.toUpperCase()] ?? player.country.code}</span>

            <span>Classement {player.sex === "F" ? "WTP" : "ATP"}: {player.data.rank}</span>
            <span>Points: {player.data.points}</span>

            <div id="last">
                <b>Derniers résultats</b>

                {#each player.data.last as match}
                    <span style="background-color:{match === 1 ? 'green' : 'red'} ;">{match === 1 ? "V" : "D"}</span>
                {/each}
            </div>
        </div>
    </div>
{/if}

<style>
    #last span {
        width: 10px;
        height: 10px;
        margin-right: 5px;
        padding: 5px;
        color: white;
    }
</style>
