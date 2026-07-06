# Updated Database Model v1.3

## Purpose

The database should support capability-driven, skill-driven, mission-based learning.

## New/Updated Entities

### capabilities

- id
- name
- description
- order_index

Examples: Think, Understand, Build, Improve, Lead

### skill_domains

- id
- capability_id
- name
- description

Examples: Data Analysis, AI-Assisted Development, CMS, Robotics

### skills

- id
- skill_domain_id
- name
- description

### competencies

- id
- skill_id
- name
- level
- description

### missions

- id
- title
- problem_statement
- target_users
- difficulty
- status

### mission_skills

- id
- mission_id
- skill_id

### mission_stages

- id
- mission_id
- stage
- title
- instructions
- order_index

Stage values:

- experience
- understand
- rebuild
- master
- teach

### student_skill_progress

- id
- student_id
- skill_id
- current_level
- evidence_count
- ai_independence_score

### evidence_items

- id
- student_id
- mission_id
- stage
- type
- url
- description
- created_at

### prompt_library_items

- id
- student_id
- category
- prompt_text
- use_case
- reflection

### ai_interactions

- id
- user_id
- assistant_mode
- mission_id
- stage
- prompt
- response
- created_at

## Key Architecture Rule

Do not hardcode skills into the app. Store skills and domains as content/data.
