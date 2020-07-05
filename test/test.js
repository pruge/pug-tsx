const expect = require('chai').expect;
const {
  preprocessor: p,
  findVarsInImport,
  findVarsInPug,
  findAllBacktickTemplate,
  getIntersectedVars,
  getOptions,
} = require('../dist/preprocessor');
const fs = require('fs');

// const files = [
//   './components/Button/index.tsx',
//   './components/Button/Button.stories.tsx',
//   './components/ButtonGroup/index.tsx',
//   './components/ButtonGroup/ButtonGroup.stories.tsx',
//   './components/Dialog/index.tsx',
//   './components/Dialog/Dialog.stories.tsx',
//   './pages/[id].tsx',
// ];

describe('pug-tsx', () => {
  describe('./test/components/Button/index.tsx', () => {
    let importedVars, usedVars, intersectedVars;
    let content, options;

    before(() => {
      const file = './test/components/Button/index.tsx';
      content = fs.readFileSync(file, 'utf8');
      options = getOptions({});
    });

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content);
      expect(importedVars).to.have.members(['jsx', 'css']);
    });

    it('findVarsInPug', () => {
      let { pattern } = options;
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      );
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
      ]);
    });

    it('getIntersectedVars', () => {
      let { includes } = options;
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes);
      expect(intersectedVars).to.have.members(['jsx']);
    });
  });

  describe('./test/components/Button/Button.stories.tsx', () => {
    let importedVars, usedVars, intersectedVars;
    let content, options;

    before(() => {
      const file = './test/components/Button/Button.stories.tsx';
      content = fs.readFileSync(file, 'utf8');
      options = getOptions({});
    });

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content);
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
      ]);
    });

    it('findVarsInPug', () => {
      let { pattern } = options;
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      );
      expect(usedVars).to.have.members([
        'Button',
        'theme',
        'width',
        'size',
        'disabled',
        'action',
        'label',
        'buttonWrapper',
      ]);
    });

    it('getIntersectedVars', () => {
      let { includes } = options;
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes);
      expect(intersectedVars).to.have.members(['jsx', 'Button', 'action']);
    });
  });

  describe('./test/components/ButtonGroup/index.tsx', () => {
    let importedVars, usedVars, intersectedVars;
    let content, options;

    before(() => {
      const file = './test/components/ButtonGroup/index.tsx';
      content = fs.readFileSync(file, 'utf8');
      options = getOptions({});
    });

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content);
      expect(importedVars).to.have.members(['React', 'css', 'jsx']);
    });

    it('findVarsInPug', () => {
      let { pattern } = options;
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      );
      expect(usedVars).to.have.members([
        'direction',
        'gapStyle',
        'gap',
        'rightAlign',
        'rightAlignStyle',
        'className',
        'children',
      ]);
    });

    it('getIntersectedVars', () => {
      let { includes } = options;
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes);
      expect(intersectedVars).to.have.members(['jsx', 'React']);
    });
  });

  describe('./test/components/ButtonGroup/ButtonGroup.stories.tsx', () => {
    let importedVars, usedVars, intersectedVars;
    let content, options;

    before(() => {
      const file = './test/components/ButtonGroup/ButtonGroup.stories.tsx';
      content = fs.readFileSync(file, 'utf8');
      options = getOptions({});
    });

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content);
      expect(importedVars).to.have.members([
        'React',
        'Button',
        'ButtonGroup',
        'withKnobs',
        'text',
        'radios',
        'boolean',
      ]);
    });

    it('findVarsInPug', () => {
      let { pattern } = options;
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      );
      expect(usedVars).to.have.members([
        'ButtonGroup',
        'direction',
        'gap',
        'Button',
        'rightAlign',
      ]);
    });

    it('getIntersectedVars', () => {
      let { includes } = options;
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes);
      expect(intersectedVars).to.have.members([
        'ButtonGroup',
        'Button',
        'React',
      ]);
    });
  });

  describe('./test/components/Dialog/index.tsx', () => {
    let importedVars, usedVars, intersectedVars;
    let content, options;

    before(() => {
      const file = './test/components/Dialog/index.tsx';
      content = fs.readFileSync(file, 'utf8');
      options = getOptions({});
    });

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content);
      expect(importedVars).to.have.members([
        'css',
        'jsx',
        'React',
        'Button',
        'ButtonGroup',
        'useTransition',
        'animated',
      ]);
    });

    it('findVarsInPug', () => {
      let { pattern } = options;
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      );
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
      ]);
    });

    it('getIntersectedVars', () => {
      let { includes } = options;
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes);
      expect(intersectedVars).to.have.members([
        'ButtonGroup',
        'Button',
        'React',
        'jsx',
      ]);
    });
  });

  describe('./test/components/Dialog/Dialog.stories.tsx', () => {
    let importedVars, usedVars, intersectedVars;
    let content, options;

    before(() => {
      const file = './test/components/Dialog/Dialog.stories.tsx';
      content = fs.readFileSync(file, 'utf8');
      options = getOptions({});
    });

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content);
      expect(importedVars).to.have.members([
        'React',
        'Dialog',
        'withKnobs',
        'text',
        'boolean',
      ]);
    });

    it('findVarsInPug', () => {
      let { pattern } = options;
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      );
      expect(usedVars).to.have.members([
        'Dialog',
        'title',
        'description',
        'visible',
        'confirmText',
        'cancelText',
        'cancellable',
      ]);
    });

    it('getIntersectedVars', () => {
      let { includes } = options;
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes);
      expect(intersectedVars).to.have.members(['React', 'Dialog']);
    });
  });

  describe('./test/pages/[id].tsx', () => {
    let importedVars, usedVars, intersectedVars;
    let content, options;

    before(() => {
      const file = './test/pages/[id].tsx';
      content = fs.readFileSync(file, 'utf8');
      options = getOptions({});
    });

    it('findVarsInImport', () => {
      importedVars = findVarsInImport(content);
      expect(importedVars).to.have.members([
        'React',
        'GetServerSideProps',
        'ReactMarkdown',
        'Layout',
        'fetch',
        'Router',
        'makeStyles',
        'PostProps',
      ]);
    });

    it('findVarsInPug', () => {
      let { pattern } = options;
      usedVars = findVarsInPug(
        findAllBacktickTemplate(content, pattern),
        pattern,
      );
      expect(usedVars).to.have.members([
        'Layout',
        'title',
        'ReactMarkdown',
        'props',
        'handlePublish',
        'handleDelete',
      ]);
    });

    it('getIntersectedVars', () => {
      let { includes } = options;
      intersectedVars = getIntersectedVars(usedVars, importedVars, includes);
      expect(intersectedVars).to.have.members([
        'Layout',
        'ReactMarkdown',
        'React',
      ]);
    });
  });
});
