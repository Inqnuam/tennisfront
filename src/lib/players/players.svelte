<script>
    import { onMount } from "svelte";
    import { api } from "../tools/api";
    import { Table, Modal, ModalFooter } from "sveltestrap";
    import Profile from "./profile.svelte";
    import Stats from "./stats.svelte";
    import EditPlayer from "./Editplayer.svelte";
    import { players, api_key, countries } from "../stores.js";
    import KeyIcon from "../resources/icones/key.svelte";
    import { newPlayer } from "./helpers.js";
    onMount(() => {
        api("GET", "/tasks/task1")
            .then((res) => {
                $players = res;
            })
            .catch((err) => {
                alert(err.cli);
            });
    });

    const DETAILS = 0;
    const EDIT = 1;
    const AUTH = 2;
    const STATS = 3;

    let currentPlayer = null;
    let currentKey = "";
    let errMsg = "";
    let modalType = DETAILS;
    let modalTitle = "";
    let isOpen = false;
    let isLoading = false;
    let isLoadingDelete = false;
    let isLoadingStats = false;

    const toggle = () => (isOpen = !isOpen);

    function setPlayer(player, isNew = false) {
        currentPlayer = player;
        if (isNew) {
            modalType = EDIT;
            modalTitle = "Nouveau joueur";
        } else {
            modalType = DETAILS;
            modalTitle = player.fullname;
        }

        isOpen = true;
    }

    function deletePlayer() {
        isLoadingDelete = true;

        api("DELETE", `/players/profile/${currentPlayer.id}`)
            .then((res) => {
                const foundIndex = $players.findIndex((x) => x.id == res.deleted);

                if (foundIndex > -1) {
                    isOpen = false;
                    $players.splice(foundIndex, 1);
                    $players = $players;
                }
            })
            .catch((err) => {
                errMsg = err.error.cli;
            })
            .finally(() => {
                isLoadingDelete = false;
            });
    }

    function sendPlayerToDB() {
        if ($countries[currentPlayer.country.code.toUpperCase()]) {
            isLoading = true;

            currentPlayer.birthday = typeof currentPlayer.birthday == "number" ? currentPlayer.birthday : currentPlayer.birthday.getTime();
            api(currentPlayer.id == "" ? "POST" : "PATCH", "/players/profile", currentPlayer)
                .then((res) => {
                    const foundIndex = $players.findIndex((x) => x.id == res.id);

                    if (foundIndex === -1) {
                        $players.push(res);
                        $players = $players;
                    } else {
                        $players[foundIndex] = res;
                    }
                    isOpen = false;
                })
                .catch((err) => {
                    errMsg = err.error.cli;
                })
                .finally(() => {
                    isLoading = false;
                });
        } else {
            errMsg = "Le code du pays est incorrect";
        }
    }
    function showApiKey() {
        currentKey = $api_key;
        modalType = AUTH;
        modalTitle = "Authentification";
        isOpen = true;
    }

    function checkKey() {
        isLoading = true;
        api("GET", "/key/" + currentKey)
            .then((res) => {
                if (res.validKey) {
                    $api_key = currentKey;
                    isOpen = false;
                } else {
                    isLoading = false;
                    errMsg = "Cette clé est invalide.";
                }
            })
            .catch((err) => {})
            .finally(() => {
                isLoading = false;
            });
    }
</script>

<div>
    <div class="d-flex justify-content-between mb-3">
        <div>
            {#if isLoadingStats}
                <div class="spinner-border text-success ms-2" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
            {:else}
                <button
                    class="btn btn-success shadow-none"
                    on:click={() => {
                        modalType = STATS;
                        modalTitle = "Statistiques";
                        isOpen = true;
                    }}>Plus de stats</button
                >
            {/if}
        </div>

        <div>
            {#if $api_key !== ""}
                <button
                    class="btn btn-primary shadow-none"
                    on:click={() => {
                        setPlayer(newPlayer(), true);
                    }}>Ajouter</button
                >
            {:else}
                <button class="btn btn-warning shadow-none me-2" on:click={showApiKey}><KeyIcon /></button>
            {/if}
        </div>
    </div>

    <Table striped hover bordered>
        <thead>
            <tr>
                <th>Pays</th>
                <th>Nom</th>
                <th>Age</th>
                <th>Sexe</th>
                <th>Points</th>
            </tr>
        </thead>
        <tbody>
            {#each $players as player}
                <tr on:click={() => setPlayer(player)}>
                    <td>
                        <!-- svelte-ignore a11y-img-redundant-alt -->
                        <img
                            on:error={(e) => {
                                e.target.src = "https://countryflagsapi.com/png/" + player.country.code.toLowerCase();
                            }}
                            width="15"
                            height="15"
                            src={player.country.picture}
                            alt="drapeau {player.country.code}"
                        />
                    </td>
                    <td>{player.fullname}</td>
                    <td>{player.data.age}</td>
                    <td>{player.sex}</td>
                    <td>{player.data.points}</td>
                </tr>
            {/each}
        </tbody>
    </Table>

    <Modal
        {isOpen}
        {toggle}
        centered
        body
        header={modalTitle}
        size="lg"
        on:close={() => {
            isLoading = false;
            isLoadingDelete = false;
            errMsg = "";
            modalType = DETAILS;
        }}
    >
        {#if modalType === DETAILS}
            <Profile player={currentPlayer} />
        {:else if modalType === AUTH}
            <div class="m-3">
                <label for="api_key" class="form-label">Veuillez rentrer la clé d'autorisation:</label>
                <input autocomplete="off" type="password" class="form-control mb-2" id="api_key" bind:value={currentKey} />
            </div>
        {:else if modalType === EDIT}
            <EditPlayer player={currentPlayer} />
        {:else if modalType === STATS}
            <Stats
                bind:isLoading={isLoadingStats}
                on:error={(e) => {
                    errMsg = e.detail.msg;
                }}
            />
        {/if}

        {#if errMsg !== ""}
            <div class="badge bg-danger">{errMsg}</div>
        {/if}

        <ModalFooter class="d-flex flex-row justify-content-between mt-2">
            <div>
                {#if modalType === EDIT && currentPlayer.id !== ""}
                    {#if isLoadingDelete}
                        <div class="spinner-border text-danger ms-2" role="status">
                            <span class="visually-hidden">Chargement...</span>
                        </div>
                    {:else}
                        <button class="btn btn-danger shadow-none" on:click={deletePlayer}>Supprimer</button>
                    {/if}
                {/if}
            </div>

            <div>
                <button class="btn btn-secondary me-1" on:click={toggle}>Fermer</button>
                {#if isLoading}
                    <div class="spinner-border text-primary ms-2" role="status">
                        <span class="visually-hidden">Chargement...</span>
                    </div>
                {:else if modalType === AUTH}
                    <button disabled={currentKey.trim() === ""} class="btn btn-primary shadow-none" on:click={checkKey}>Valider</button>
                {:else if $api_key !== ""}
                    {#if modalType === DETAILS}
                        <button class="btn btn-primary shadow-none" on:click={() => (modalType = EDIT)}>Modifier</button>
                    {:else}
                        <button class="btn btn-primary shadow-none" on:click={sendPlayerToDB}>Envoyer</button>
                    {/if}
                {/if}
            </div>
        </ModalFooter>
    </Modal>
</div>

<style>
    tbody tr {
        cursor: pointer;
    }

    tbody tr td:first-child {
        text-align: center;
    }
</style>
