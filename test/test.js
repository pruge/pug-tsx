const expect = require('chai').expect
const {
  preprocessor: p,
  findVarsInImport,
  findVarsInPug,
  findAllBacktickTemplate,
  getIntersectedVars,
  getOptions,
} = require('../dist/preprocessor')
const fs = require('fs')

describe('pug-tsx', () => {
  describe('./test/components/Button/index.tsx', () => {
    let importedVars, usedVars, intersectedVars
    let content, options

    before(() => {
      const file = './test/components/Button/index.tsx'
      content = fs.readFileSync(file, 'utf8')
      options = getOptions({})
    })

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content)
      expect(importedVars).to.have.members(['jsx', 'css'])
    })

    it('findVarsInPug', () => {
      let { pattern } = options
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      )
      expect(usedVars).to.have.members([
        'style',
        'themes',
        'theme',
        'sizes',
        'size',
        'width',
        'disabled',
        'onClick',
        'children',
      ])
    })

    it('getIntersectedVars', () => {
      let { includes } = options
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes)
      expect(intersectedVars).to.have.members(['jsx'])
    })
  })

  describe('./test/components/Button/Button.stories.tsx', () => {
    let importedVars, usedVars, intersectedVars
    let content, options

    before(() => {
      const file = './test/components/Button/Button.stories.tsx'
      content = fs.readFileSync(file, 'utf8')
      options = getOptions({})
    })

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content)
      expect(importedVars).to.have.members([
        'jsx',
        'css',
        'Button',
        'withKnobs',
        'text',
        'select',
        'boolean',
        'action',
        'ButtonGroup',
      ])
    })

    it('findVarsInPug', () => {
      let { pattern } = options
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      )
      expect(usedVars).to.have.members([
        'Button',
        'theme',
        'width',
        'size',
        'disabled',
        'action',
        'label',
        'buttonWrapper',
      ])
    })

    it('getIntersectedVars', () => {
      let { includes } = options
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes)
      expect(intersectedVars).to.have.members(['jsx', 'Button', 'action'])
    })
  })

  describe('./test/components/ButtonGroup/index.tsx', () => {
    let importedVars, usedVars, intersectedVars
    let content, options

    before(() => {
      const file = './test/components/ButtonGroup/index.tsx'
      content = fs.readFileSync(file, 'utf8')
      options = getOptions({})
    })

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content)
      expect(importedVars).to.have.members(['React', 'css', 'jsx'])
    })

    it('findVarsInPug', () => {
      let { pattern } = options
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      )
      expect(usedVars).to.have.members([
        'direction',
        'gapStyle',
        'gap',
        'rightAlign',
        'rightAlignStyle',
        'className',
        'children',
      ])
    })

    it('getIntersectedVars', () => {
      let { includes } = options
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes)
      expect(intersectedVars).to.have.members(['jsx', 'React'])
    })
  })

  describe('./test/components/ButtonGroup/ButtonGroup.stories.tsx', () => {
    let importedVars, usedVars, intersectedVars
    let content, options

    before(() => {
      const file = './test/components/ButtonGroup/ButtonGroup.stories.tsx'
      content = fs.readFileSync(file, 'utf8')
      options = getOptions({})
    })

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content)
      expect(importedVars).to.have.members([
        'React',
        'Button',
        'ButtonGroup',
        'withKnobs',
        'text',
        'radios',
        'boolean',
      ])
    })

    it('findVarsInPug', () => {
      let { pattern } = options
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      )
      expect(usedVars).to.have.members([
        'ButtonGroup',
        'direction',
        'gap',
        'Button',
        'rightAlign',
      ])
    })

    it('getIntersectedVars', () => {
      let { includes } = options
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes)
      expect(intersectedVars).to.have.members([
        'ButtonGroup',
        'Button',
        'React',
      ])
    })
  })

  describe('./test/components/Dialog/index.tsx', () => {
    let importedVars, usedVars, intersectedVars
    let content, options

    before(() => {
      const file = './test/components/Dialog/index.tsx'
      content = fs.readFileSync(file, 'utf8')
      options = getOptions({})
    })

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content)
      expect(importedVars).to.have.members([
        'css',
        'jsx',
        'React',
        'Button',
        'ButtonGroup',
        'useTransition',
        'animated',
      ])
    })

    it('findVarsInPug', () => {
      let { pattern } = options
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      )
      expect(usedVars).to.have.members([
        'React',
        'ButtonGroup',
        'Button',
        'item',
        'AnimatedDiv',
        'fullscreen',
        'darkLayer',
        'key',
        'props',
        'whiteBoxWrapper',
        'whiteBox',
        'title',
        'description',
        'children',
        'hideButtons',
        'cancellable',
        'onCancel',
        'cancelText',
        'onConfirm',
        'confirmText',
      ])
    })

    it('getIntersectedVars', () => {
      let { includes } = options
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes)
      expect(intersectedVars).to.have.members([
        'ButtonGroup',
        'Button',
        'React',
        'jsx',
      ])
    })
  })

  describe('./test/components/Dialog/Dialog.stories.tsx', () => {
    let importedVars, usedVars, intersectedVars
    let content, options

    before(() => {
      const file = './test/components/Dialog/Dialog.stories.tsx'
      content = fs.readFileSync(file, 'utf8')
      options = getOptions({})
    })

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content)
      expect(importedVars).to.have.members([
        'React',
        'Dialog',
        'withKnobs',
        'text',
        'boolean',
      ])
    })

    it('findVarsInPug', () => {
      let { pattern } = options
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      )
      expect(usedVars).to.have.members([
        'Dialog',
        'title',
        'description',
        'visible',
        'confirmText',
        'cancelText',
        'cancellable',
      ])
    })

    it('getIntersectedVars', () => {
      let { includes } = options
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes)
      expect(intersectedVars).to.have.members(['React', 'Dialog'])
    })
  })

  describe('./test/pages/[id].tsx', () => {
    let importedVars, usedVars, intersectedVars
    let content, options

    before(() => {
      const file = './test/pages/[id].tsx'
      content = fs.readFileSync(file, 'utf8')
      options = getOptions({})
    })

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content)
      expect(importedVars).to.have.members([
        'React',
        'GetServerSideProps',
        'ReactMarkdown',
        'Layout',
        'fetch',
        'Router',
        'makeStyles',
        'PostProps',
      ])
    })

    it('findVarsInPug', () => {
      let { pattern } = options
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      )
      expect(usedVars).to.have.members([
        'Layout',
        'title',
        'ReactMarkdown',
        'props',
        'handlePublish',
        'handleDelete',
      ])
    })

    it('getIntersectedVars', () => {
      let { includes } = options
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes)
      expect(intersectedVars).to.have.members([
        'Layout',
        'ReactMarkdown',
        'React',
      ])
    })
  })

  describe('./test/pages/create.tsx', () => {
    let importedVars, usedVars, intersectedVars
    let content, options

    before(() => {
      const file = './test/pages/create.tsx'
      content = fs.readFileSync(file, 'utf8')
      options = getOptions({})
    })

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content)
      expect(importedVars).to.have.members([
        'React',
        'useState',
        'fetch',
        'makeStyles',
        'Layout',
        'Router',
      ])
    })

    it('findVarsInPug', () => {
      let { pattern } = options
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      )
      expect(usedVars).to.have.members([
        'Layout',
        'classes',
        'submitData',
        'test',
        'title',
        'authorEmail',
        'content',
      ])
    })

    it('getIntersectedVars', () => {
      let { includes } = options
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes)
      expect(intersectedVars).to.have.members(['Layout', 'React'])
    })
  })

  describe('./test/components/CardToolbar.tsx', () => {
    let importedVars, usedVars, intersectedVars
    let content, options

    before(() => {
      const file = './test/components/CardToolbar.tsx'
      content = fs.readFileSync(file, 'utf8')
      options = getOptions({ start: ['gql`', '\\{`'] })
    })

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content)
      expect(importedVars).to.have.members([
        'React',
        'clsx',
        'useCards',
        'makeStyles',
        'Toolbar',
        'IconButton',
        'MailIcon',
        'OneIcon',
        'TwoIcon',
        'FullIcon',
        'SomeIcon',
        'ToggleIconButton',
      ])
    })

    it('findVarsInPug', () => {
      let { pattern } = options
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      )
      expect(usedVars).to.have.members([
        'SomeIcon',
        'FullIcon',
        'props',
        'Toolbar',
        'clsx',
        'classes',
        'cardScrolling',
        'IconButton',
        'setColumn',
        'getColor',
        'OneIcon',
        'TwoIcon',
        'ToggleIconButton',
        'test',
      ])
    })

    it('getIntersectedVars', () => {
      let { includes } = options
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes)
      expect(intersectedVars).to.have.members([
        'SomeIcon',
        'FullIcon',
        'Toolbar',
        'clsx',
        'IconButton',
        'OneIcon',
        'TwoIcon',
        'ToggleIconButton',
        'React',
      ])
    })
  })

  describe('./test/components/AllTags.tsx', () => {
    let importedVars, usedVars, intersectedVars
    let content, options

    before(() => {
      const file = './test/components/AllTags.tsx'
      content = fs.readFileSync(file, 'utf8')
      options = getOptions({ start: ['gql`', '\\{`'] })
    })

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content)
      expect(importedVars).to.have.members([
        'React',
        'useState',
        'useTags',
        'useCards',
        'useToggleTagMutation',
        'useDeleteTagMutation',
        'TagsDocument',
        'Card',
        'CardDocument',
        'joinTags',
        'addmoveListCache',
        'addmoveSubListCache',
        'makeStyles',
        'Collapse',
        'Divider',
        'Typography',
        'Alert',
        'Tags',
      ])
    })

    it('findVarsInPug', () => {
      let { pattern } = options
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      )
      expect(usedVars).to.have.members([
        'IconButton',
        'setOpen',
        'CloseIcon',
        'Collapse',
        'open',
        'Alert',
        'test',
        'groups',
        'Divider',
        'classes',
        'Typography',
        'grouped',
        'Tags',
        'isAttachTag',
        'handleClick',
        'handleCopyClick',
        'handleDeleteClick',
      ])
    })

    it('getIntersectedVars', () => {
      let { includes } = options
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes)
      expect(intersectedVars).to.have.members([
        'Collapse',
        'Alert',
        'Divider',
        'Typography',
        'Tags',
        'React',
      ])
    })
  })

  describe('./test/components/TodoList.tsx', () => {
    let importedVars, usedVars, intersectedVars
    let content, options

    before(() => {
      const file = './test/components/TodoList.tsx'
      content = fs.readFileSync(file, 'utf8')
      options = getOptions({ start: ['gql`', '\\{`'] })
    })

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content)
      expect(importedVars).to.have.members([
        'React',
        'TodoItem',
        'TodoListProps',
      ])
    })

    it('findVarsInPug', () => {
      let { pattern } = options
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      )
      expect(usedVars).to.have.members([
        'todos',
        'TodoItem',
        'onToggle',
        'onRemove',
      ])
    })

    it('getIntersectedVars', () => {
      let { includes } = options
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes)
      expect(intersectedVars).to.have.members(['TodoItem', 'React'])
    })
  })
})
