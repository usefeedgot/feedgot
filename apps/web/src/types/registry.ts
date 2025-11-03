import type { ComponentType } from 'react'
import MrrTool from '../components/tools/revenue/mrr'
import ChurnTool from '../components/tools/retention/churn'
import NpsTool from '../components/tools/feedback/nps'
import FeedbackTemplatesTool from '../components/tools/feedback/templates'
import FeatureAdoptionTool from '../components/tools/product/feature-adoption'
import CohortAnalysisTool from '../components/tools/product/cohort-analysis'

export const TOOL_COMPONENTS: Record<string, Record<string, ComponentType>> = {
  'product-feature-analytics': {
    'feature-adoption-calculator': FeatureAdoptionTool,
    'cohort-analysis': CohortAnalysisTool,
  },
  'revenue-growth': {
    'mrr-calculator': MrrTool,
  },
  'customer-metrics': {
    'churn-calculator': ChurnTool,
    'nps-calculator': NpsTool,
    'feedback-templates': FeedbackTemplatesTool,
  },
}