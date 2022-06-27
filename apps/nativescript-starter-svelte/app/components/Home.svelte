<page>
    <actionBar title="Home" />
    <gridLayout>
        <label class="info" text="{message}" />
    </gridLayout>
</page>

<script lang="ts">
    let message: string = "Blank Svelte Native App"
</script>

<style>
    .info {
        font-size: 20;
        horizontal-align: center;
        vertical-align: center;
    }
</style>
