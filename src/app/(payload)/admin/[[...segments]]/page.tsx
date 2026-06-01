import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import type { Metadata } from 'next'
import config from '@payload-config'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

// Non-async: returns the Promise from RootPage directly so React can
// track the component context correctly (async call breaks React.use / cache)
export default function Page({ params, searchParams }: Args) {
  return RootPage({ config, params, searchParams, importMap })
}
