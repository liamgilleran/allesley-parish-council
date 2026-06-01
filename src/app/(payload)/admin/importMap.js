import { S3ClientUploadHandler as S3ClientUploadHandler_0 } from '@payloadcms/storage-s3/client'
import { CollectionCards as CollectionCards_0 } from '@payloadcms/next/rsc'

// Lexical RSC entry points
import { RscEntryLexicalCell as RscEntryLexicalCell_0 } from '@payloadcms/richtext-lexical/rsc'
import { RscEntryLexicalField as RscEntryLexicalField_0 } from '@payloadcms/richtext-lexical/rsc'

// Lexical client feature registrations — ALL default features must be listed here
// or their slash menu items, toolbar buttons and node types won't initialise.
import {
  BoldFeatureClient,
  ItalicFeatureClient,
  UnderlineFeatureClient,
  StrikethroughFeatureClient,
  SubscriptFeatureClient,
  SuperscriptFeatureClient,
  InlineCodeFeatureClient,
  ParagraphFeatureClient,
  HeadingFeatureClient,
  AlignFeatureClient,
  IndentFeatureClient,
  UnorderedListFeatureClient,
  OrderedListFeatureClient,
  ChecklistFeatureClient,
  LinkFeatureClient,
  RelationshipFeatureClient,
  BlockquoteFeatureClient,
  UploadFeatureClient,
  HorizontalRuleFeatureClient,
  InlineToolbarFeatureClient,
  FixedToolbarFeatureClient,
  // Code block UI components
  CodeBlockBlockComponent,
  CodeComponent,
} from '@payloadcms/richtext-lexical/client'

export const importMap = {
  '@payloadcms/storage-s3/client#S3ClientUploadHandler': S3ClientUploadHandler_0,
  '@payloadcms/next/rsc#CollectionCards': CollectionCards_0,

  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell': RscEntryLexicalCell_0,
  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalField': RscEntryLexicalField_0,

  '@payloadcms/richtext-lexical/client#BoldFeatureClient': BoldFeatureClient,
  '@payloadcms/richtext-lexical/client#ItalicFeatureClient': ItalicFeatureClient,
  '@payloadcms/richtext-lexical/client#UnderlineFeatureClient': UnderlineFeatureClient,
  '@payloadcms/richtext-lexical/client#StrikethroughFeatureClient': StrikethroughFeatureClient,
  '@payloadcms/richtext-lexical/client#SubscriptFeatureClient': SubscriptFeatureClient,
  '@payloadcms/richtext-lexical/client#SuperscriptFeatureClient': SuperscriptFeatureClient,
  '@payloadcms/richtext-lexical/client#InlineCodeFeatureClient': InlineCodeFeatureClient,
  '@payloadcms/richtext-lexical/client#ParagraphFeatureClient': ParagraphFeatureClient,
  '@payloadcms/richtext-lexical/client#HeadingFeatureClient': HeadingFeatureClient,
  '@payloadcms/richtext-lexical/client#AlignFeatureClient': AlignFeatureClient,
  '@payloadcms/richtext-lexical/client#IndentFeatureClient': IndentFeatureClient,
  '@payloadcms/richtext-lexical/client#UnorderedListFeatureClient': UnorderedListFeatureClient,
  '@payloadcms/richtext-lexical/client#OrderedListFeatureClient': OrderedListFeatureClient,
  '@payloadcms/richtext-lexical/client#ChecklistFeatureClient': ChecklistFeatureClient,
  '@payloadcms/richtext-lexical/client#LinkFeatureClient': LinkFeatureClient,
  '@payloadcms/richtext-lexical/client#RelationshipFeatureClient': RelationshipFeatureClient,
  '@payloadcms/richtext-lexical/client#BlockquoteFeatureClient': BlockquoteFeatureClient,
  '@payloadcms/richtext-lexical/client#UploadFeatureClient': UploadFeatureClient,
  '@payloadcms/richtext-lexical/client#HorizontalRuleFeatureClient': HorizontalRuleFeatureClient,
  '@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient': InlineToolbarFeatureClient,
  '@payloadcms/richtext-lexical/client#FixedToolbarFeatureClient': FixedToolbarFeatureClient,
  '@payloadcms/richtext-lexical/client#CodeBlockBlockComponent': CodeBlockBlockComponent,
  '@payloadcms/richtext-lexical/client#CodeComponent': CodeComponent,
}
