class Posts
{
  constructor()
  {
    this.data = require('../posts-example.json');
  }

  get(data = 'last', offset = 0, limit = 1)
  {
    if (data === 'recent') {
      limit = 3;
    }

    // Copy data instead of referencing it for sorting
    const filteredData = this.data.slice();
    filteredData.sort(this.sortByNewest);

    const recentPosts = [];

    for (let postIndex = offset; postIndex < limit; postIndex++) {
      recentPosts.push(filteredData[postIndex]);
    }

    return recentPosts;
  }

  sortByNewest(a, b)
  {
    return new Date(b.date) - new Date(a.date);
  }
}

module.exports = Posts;
