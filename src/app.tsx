import {
  action,
  createMemo,
  createOptimistic,
  createOptimisticStore,
  createSignal,
  Errored,
  flush,
  For,
  isPending,
  latest,
  Loading,
  refresh,
  Show,
} from 'solid-js';
import { type City, fetchCities, fetchFavorites, fetchWeather, regions, saveFavorite } from './api';

const formatPopulation = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : `${Math.round(n / 1e3)}K`;

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

export const App = () => {
  const [region, setRegion] = createSignal('europe');

  // Async is just a memo that returns a promise. No createResource, no loading flags.
  const cities = createMemo<City[]>(() => fetchCities(region()));

  // A signal initialised from a function: it defaults to the region's first city,
  // re-derives when the region changes, and can still be set by a tap.
  const [cityId, setCityId] = createSignal<string>(() => cities()[0].id);
  const city = createMemo(() => cities().find((c) => c.id === cityId())!);
  const weather = createMemo(() => fetchWeather(cityId()));

  // Optimistic state: shows the expected value at once, then settles to the server's.
  const [favorites, setFavorites] = createOptimisticStore<string[]>(() => fetchFavorites(), []);
  const [saving, setSaving] = createOptimistic(false);

  const toggleFavorite = action(function* (id: string) {
    const add = !favorites.includes(id);
    setSaving(true);
    setFavorites((list) => {
      if (add) list.push(id);
      else list.splice(list.indexOf(id), 1);
    });
    yield saveFavorite(id, add);
    refresh(favorites);
  });

  // latest() reads a value that is still in flight, so taps highlight immediately.
  const regionName = () => regions.find((r) => r.id === latest(region))!.name;

  return (
    <gridlayout rows="auto, auto, *" class="page">
      <gridlayout row="0" columns="*, auto" class="header">
        <stacklayout col="0">
          <label text="Explore" class="title" />
          <label text="Solid 2.0 · NativeScript" class="subtitle" />
        </stacklayout>
        <Show when={saving()}>
          <label col="1" text="Saving…" class="saving" />
        </Show>
      </gridlayout>

      <scrollview row="1" orientation="horizontal" scrollBarIndicatorVisible="false">
        <stacklayout orientation="horizontal" class="tabs">
          <For each={regions}>
            {(r) => (
              <label
                text={r.name}
                class={latest(region) === r.id ? 'tab tab-active' : 'tab'}
                on:tap={() => setRegion(r.id)}
              />
            )}
          </For>
        </stacklayout>
      </scrollview>

      <gridlayout row="2">
        <Errored
          fallback={(err, reset) => {
            const [retrying, setRetrying] = createSignal(false);
            const retry = () => {
              // flush() paints "Retrying…" now; reset() then holds this view until the retry lands.
              setRetrying(true);
              flush();
              reset();
            };
            return (
              <stacklayout class="state">
                <label text="⚠️" class="state-icon" />
                <label text={errorMessage(err())} class="state-text" />
                <button
                  text={retrying() ? 'Retrying…' : 'Try again'}
                  class="retry"
                  on:tap={() => retry()}
                />
              </stacklayout>
            );
          }}
        >
          <Loading
            fallback={
              <stacklayout class="state">
                <activityindicator busy="true" class="spinner" />
                <label text={`Loading ${regionName()}…`} class="state-text" />
              </stacklayout>
            }
          >
            <gridlayout rows="*, auto">
              <scrollview row="0" opacity={isPending(() => cities()) ? 0.4 : 1}>
                <stacklayout class="list">
                  <For each={cities()}>
                    {(c) => (
                      <gridlayout
                        columns="*, auto"
                        class={latest(cityId) === c.id ? 'row row-active' : 'row'}
                      >
                        <stacklayout col="0" on:tap={() => setCityId(c.id)}>
                          <label text={c.name} class="row-title" />
                          <label
                            text={`${c.country} · ${formatPopulation(c.population)}`}
                            class="row-detail"
                          />
                        </stacklayout>
                        <label
                          col="1"
                          text={favorites.includes(c.id) ? '★' : '☆'}
                          class="star"
                          on:tap={() => toggleFavorite(c.id)}
                        />
                      </gridlayout>
                    )}
                  </For>
                </stacklayout>
              </scrollview>

              <gridlayout row="1">
                <Loading fallback={<label text="Fetching weather…" class="card card-empty" />}>
                  <gridlayout
                    columns="auto, *, auto"
                    class="card"
                    opacity={isPending(() => weather()) ? 0.5 : 1}
                  >
                    <label col="0" text={weather().icon} class="card-icon" />
                    <stacklayout col="1">
                      <label text={city().name} class="card-title" />
                      <label text={weather().sky} class="card-detail" />
                    </stacklayout>
                    <label col="2" text={`${weather().temp}°`} class="card-temp" />
                  </gridlayout>
                </Loading>
              </gridlayout>
            </gridlayout>
          </Loading>
        </Errored>
      </gridlayout>
    </gridlayout>
  );
};
