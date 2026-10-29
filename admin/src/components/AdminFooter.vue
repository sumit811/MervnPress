<template>
  <footer class="page-footer">
    <span>Thank you for creating with <a href="#mervnpress">MervnPress.</a></span>
    <span>MervnPress</span>
  </footer>
</template>

<style lang="scss" scoped>
.page-footer {
  display: flex;
  justify-content: space-between;
  margin: auto -22px 0 -18px;
  padding: 9px 22px 10px 18px;
  color: #646970;

  span:first-child {
    font-style: italic;
  }

  a {
    text-decoration: underline;
  }
}

@media (max-width: 640px) {
  .page-footer {
    margin-right: -12px;
    margin-left: -12px;
    padding-right: 12px;
    padding-left: 12px;
  }
}
</style>