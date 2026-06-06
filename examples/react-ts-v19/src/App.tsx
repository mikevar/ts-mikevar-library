import { useDataGridStates } from "@mikevar/react-data-grid";

function App() {
  const { persistedState, draftState, actions } = useDataGridStates({
    url: "?id_a=1&id_b=2&id_c=3&filterMode=filter&search=something&page=5&limit=6&cursor=7&orders=id:asc",
    filterQueryKeys: ["name:ilike"],
    defaultQueryValues: {},
    onUrlChange(url: string) {
      console.log(url);
    },
  });

  return (
    <>
      <div>Hello World</div>
      <pre>{JSON.stringify({ persistedState, draftState }, null, 2)}</pre>
      <input
        value={draftState.filtering.search}
        onChange={(e) => actions.setSearch(e.target.value)}
      />
      <input
        value={draftState.filtering.rawFilters["name:ilike"]}
        onChange={(e) => actions.setFilter("name:ilike", e.target.value)}
      />
      <button onClick={actions.submit}>Submit</button>
    </>
  );
}

export default App;
