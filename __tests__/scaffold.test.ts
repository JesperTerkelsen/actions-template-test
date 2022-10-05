import { runTemplate } from '../src/scaffold';
import fs from 'fs-extra';
import path from 'path';

describe('scaffold', () => {
  describe('#runTemplate', () => {
    it('fails w/o copyWithoutRender', async () => {
      const targetPath = './build/1';
      await fs.emptyDir(targetPath);

      await expect(
        runTemplate({
          url: './template',
          targetPath,
          copyWithoutRender: [],
          values: {},
        })
      ).rejects.toThrow();
      // fails to template the workflow
      await expect(
        fs.pathExists(
          path.resolve(process.cwd(), targetPath, '.static/workflow.yml')
        )
      ).resolves.toEqual(false);
    });

    it('works w/ copyWithoutRender', async () => {
      const name = 'My awesome app';
      const targetPath = './build/2';
      await fs.emptyDir(targetPath);

      await expect(
        runTemplate({
          url: './template',
          targetPath,
          copyWithoutRender: ['.static'],
          values: {
            name,
          },
        })
      ).resolves.toBeUndefined();

      await expect(
        fs.pathExists(
          path.resolve(process.cwd(), targetPath, '.static/workflow.yml')
        )
      ).resolves.toEqual(true);

      // contains expected name
      expect(
        await fs.readFile(
          path.resolve(process.cwd(), targetPath, 'index.js'),
          'utf8'
        )
      ).toMatch(name);
    });

    it('works w/ deeper paths', async () => {
      const name = 'My awesome app';
      const targetPath = './build/3';
      await fs.emptyDir(targetPath);

      await expect(
        runTemplate({
          url: './template/deeply/nested_template',
          targetPath,
          values: {
            name,
          },
        })
      ).resolves.toBeUndefined();

      // contains expected name
      expect(
        await fs.readFile(
          path.resolve(process.cwd(), targetPath, 'index.js'),
          'utf8'
        )
      ).toMatch(name);
    });
  });
});
