import { createCollection, localOnlyCollectionOptions } from '@tanstack/react-db'
import { content, type Post, type Project } from '#/content'

export type { Post, Project }

// Every project from content.json lives in a TanStack DB
// collection keyed by slug. Pages read it with live queries.
export const projectsCollection = createCollection(
  localOnlyCollectionOptions({
    id: 'projects',
    getKey: (project: Project) => project.slug,
    initialData: content.projects,
  }),
)

// Blog posts, keyed by slug, newest first via live queries.
export const postsCollection = createCollection(
  localOnlyCollectionOptions({
    id: 'posts',
    getKey: (post: Post) => post.slug,
    initialData: content.posts,
  }),
)
