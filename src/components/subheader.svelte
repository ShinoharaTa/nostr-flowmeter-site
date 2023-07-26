<script>
  import { page } from "$app/stores";
  import { parse, format, isValid } from "date-fns";

  let selectedDate = format(new Date(), "yyyy-MM-dd");
  let radioSelection = "0";
  const dateParam = $page.params.date;

  if (dateParam) {
    const parsedDate = parse(dateParam, "yyyyMMdd", new Date());
    if (isValid(parsedDate)) {
      selectedDate = format(parsedDate, "yyyy-MM-dd");
      radioSelection = "1";
    } else {
      console.error("Invalid date parameter:", dateParam);
    }
  }

  const update = () => {
    if (radioSelection === "0") {
      selectedDate = format(new Date(), "yyyy-MM-dd");
      location.href = "/";
    }
    if (radioSelection === "1") {
      location.href = "/" + format(new Date(), "yyyyMMdd");
    }
  };
  const selectDate = () => {
    location.href = "/" + format(new Date(selectedDate), "yyyyMMdd");
  };
</script>

<div>
  <div class="bg-light-sub">
    <div
      class="max-width mx-auto d-md-flex justify-content-between align-items-center container flex-row-reverse pt-2"
    >
      <div class="">
        日付を選択：
        <input
          type="date"
          class=""
          bind:value={selectedDate}
          on:change={selectDate}
        />
      </div>
      <div class="select-sector pt-2 pb-1 px-3 bg-white mt-2">
        <label for="realtime" class="me-2">
          <input
            type="radio"
            id="realtime"
            name="choice"
            value="0"
            bind:group={radioSelection}
            on:change={update}
          />
          正時
        </label>
        <label for="minute_10">
          <input
            type="radio"
            id="minute_10"
            name="choice"
            value="1"
            bind:group={radioSelection}
            on:change={update}
          />
          10分計測
        </label>
      </div>
    </div>
  </div>
</div>

<style>
  .select-sector {
    border-radius: 10px 10px 0 0;
  }
  .select-sector input {
    vertical-align: middle;
  }
  input[type="radio"] {
    display: initial;
  }
</style>
