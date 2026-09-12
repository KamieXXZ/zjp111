const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');
const imageminSvgo = require('imagemin-svgo');
const path = require('path');
const fs = require('fs');

// 定义输入和输出目录
const inputDir = 'assets';
const outputDir = 'assets-optimized';

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 递归获取所有图片文件
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 创建对应的输出目录
      const relativePath = path.relative(inputDir, filePath);
      const outputSubDir = path.join(outputDir, relativePath);
      if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true });
      }

      // 递归处理子目录
      getAllImageFiles(filePath, fileList);
    } else {
      // 检查文件扩展名是否为图片格式
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.svg', '.gif', '.webp'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

async function optimizeImages() {
  try {
    console.log('开始优化图片...');

    // 获取所有图片文件
    const imageFiles = getAllImageFiles(inputDir);
    console.log(`找到 ${imageFiles.length} 个图片文件`);

    // 处理每个图片文件
    for (const file of imageFiles) {
      // 计算相对路径，用于输出目录结构
      const relativePath = path.relative(inputDir, file);
      const outputPath = path.join(outputDir, relativePath);

      // 获取文件扩展名
      const ext = path.extname(file).toLowerCase();

      // 根据文件类型选择适当的压缩插件
      let plugins = [];

      if (ext === '.jpg' || ext === '.jpeg') {
        plugins = [
          imageminMozjpeg({ quality: 80 })
        ];
      } else if (ext === '.png') {
        plugins = [
          imageminPngquant({ quality: [0.6, 0.8] })
        ];
      } else if (ext === '.svg') {
        plugins = [
          imageminSvgo({
            plugins: [
              { removeViewBox: false },
              { removeDimensions: true }
            ]
          })
        ];
      }

      // 压缩图片
      const files = await imagemin([file], {
        destination: path.dirname(outputPath),
        plugins: plugins
      });

      // 创建 WebP 版本
      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        const webpPath = outputPath.replace(ext, '.webp');
        await imagemin([file], {
          destination: path.dirname(webpPath),
          plugins: [
            imageminWebp({ quality: 80 })
          ]
        });
      }

      // 获取原始文件大小和压缩后文件大小
      const originalSize = fs.statSync(file).size;
      const optimizedSize = fs.statSync(files[0].dataPath).size;
      const savedBytes = originalSize - optimizedSize;
      const savedPercentage = ((savedBytes / originalSize) * 100).toFixed(2);

      console.log(`已优化: ${relativePath} - 节省了 ${savedBytes} 字节 (${savedPercentage}%)`);
    }

    console.log('图片优化完成！');
    console.log(`优化后的图片已保存到 ${outputDir} 目录`);
  } catch (error) {
    console.error('图片优化过程中出错:', error);
  }
}

// 执行优化
optimizeImages();
